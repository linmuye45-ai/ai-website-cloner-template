import test from "node:test";
import assert from "node:assert/strict";
import { parseCsv, parseShopifyCsv } from "../src/lib/commerce/csv.ts";
test("parseCsv handles quoted commas, escaped quotes and embedded newlines",()=>{
 const rows=parseCsv('Title,Description\n"Jacket, light","Line one\nLine two with ""quotes"""\n');
 assert.equal(rows.length,2);assert.equal(rows[1][0],"Jacket, light");assert.equal(rows[1][1],'Line one\nLine two with "quotes"');
});
test("Shopify import groups variant rows by product handle",()=>{
 const csv='Handle,Title,Vendor,Variant SKU,Variant Price,Option1 Value\ntrail-jacket,Trail Jacket,Northstar,NST-01-BLK,89.00,Black\ntrail-jacket,Trail Jacket,Northstar,NST-01-NVY,89.00,Navy\n';
 const products=parseShopifyCsv(csv);assert.equal(products.length,1);assert.equal(products[0].title,"Trail Jacket");assert.equal(products[0].sku,"NST-01-BLK");
});
test("Shopify import does not assign an unknown price currency",()=>{
 const missing=parseShopifyCsv("Handle,Title,Variant SKU,Variant Price\nshirt,Everyday Shirt,S-01,29.99")[0];
 assert.equal(missing.base_price,null);assert.equal(missing.attributes.currency_source,"missing");
 const known=parseShopifyCsv("Handle,Title,Variant SKU,Variant Price,Currency\nshirt,Everyday Shirt,S-01,29.99,CNY")[0];
 assert.equal(known.base_price,29.99);assert.equal(known.currency,"CNY");
});
