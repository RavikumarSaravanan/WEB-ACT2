/**
 * API Integration Utilities
 * Ready for future integration with supplier stock databases
 * 
 * This module provides functions to:
 * - Fetch real-time stock from supplier APIs
 * - Parse JSON/XML responses
 * - Merge external data with local database
 * 
 * Example Usage:
 * - Fetch supplier stock: fetchSupplierStock('supplier-api-url')
 * - Merge with local: mergeSupplierStock(localProducts, supplierData)
 */

/**
 * Fetch stock data from supplier API
 * @param {string} apiUrl - Supplier API endpoint URL
 * @param {Object} options - Request options (headers, auth, etc.)
 * @returns {Promise<Object>} Supplier stock data in JSON format
 * 
 * Example:
 * const stockData = await fetchSupplierStock('https://supplier-api.com/stock', {
 *   headers: { 'Authorization': 'Bearer token' }
 * });
 */
export const fetchSupplierStock = async (apiUrl, options = {}) => {
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`Supplier API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Error fetching supplier stock:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

/**
 * Parse XML supplier response (if needed)
 * @param {string} xmlString - XML response string
 * @returns {Promise<Object>} Parsed JSON object
 * 
 * Note: Requires xml2js or similar library
 * Install: npm install xml2js
 */
export const parseSupplierXML = async (xmlString) => {
  // Placeholder for XML parsing
  // In production, use xml2js:
  // const xml2js = require('xml2js');
  // const parser = new xml2js.Parser();
  // const result = await parser.parseStringPromise(xmlString);
  // return result;
  
  throw new Error('XML parsing not implemented. Install xml2js for XML support.');
};

/**
 * Merge supplier stock data with local products
 * @param {Array} localProducts - Products from local database
 * @param {Object} supplierData - Stock data from supplier API
 * @param {Function} matchFunction - Function to match supplier products to local products
 * @returns {Array} Merged products with updated stock information
 * 
 * Example:
 * const merged = mergeSupplierStock(localProducts, supplierData, (local, supplier) => {
 *   return local.sku === supplier.product_sku;
 * });
 */
export const mergeSupplierStock = (localProducts, supplierData, matchFunction) => {
  return localProducts.map(localProduct => {
    const supplierProduct = supplierData.find(supplier => 
      matchFunction(localProduct, supplier)
    );

    if (supplierProduct) {
      return {
        ...localProduct,
        supplier_stock: supplierProduct.stock,
        supplier_price: supplierProduct.price,
        last_synced: new Date().toISOString()
      };
    }

    return localProduct;
  });
};

/**
 * Update local database with supplier stock data
 * This function can be called periodically to sync stock
 * 
 * @param {Array} mergedProducts - Products with merged supplier data
 * @param {Function} updateFunction - Function to update database (from DAL)
 * @returns {Promise<Object>} Update results
 */
export const updateLocalStockFromSupplier = async (mergedProducts, updateFunction) => {
  const results = {
    updated: 0,
    failed: 0,
    errors: []
  };

  for (const product of mergedProducts) {
    try {
      if (product.supplier_stock !== undefined) {
        await updateFunction(product.id, {
          stock: product.supplier_stock,
          updated_at: product.last_synced
        });
        results.updated++;
      }
    } catch (error) {
      results.failed++;
      results.errors.push({
        product_id: product.id,
        error: error.message
      });
    }
  }

  return results;
};

/**
 * Example: Complete workflow for supplier API integration
 * This function demonstrates how to integrate supplier stock in your application
 * 
 * async function syncSupplierStock() {
 *   // 1. Fetch from supplier API
 *   const supplierData = await fetchSupplierStock('https://supplier-api.com/stock');
 *   
 *   // 2. Get local products
 *   const localProducts = await getAllProducts();
 *   
 *   // 3. Merge data
 *   const merged = mergeSupplierStock(localProducts, supplierData.data, (local, supplier) => {
 *     return local.sku === supplier.product_sku;
 *   });
 *   
 *   // 4. Update local database
 *   const results = await updateLocalStockFromSupplier(merged, updateProduct);
 *   
 *   console.log(`Synced ${results.updated} products`);
 * }
 */

