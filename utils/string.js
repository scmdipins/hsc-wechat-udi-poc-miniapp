 function isStrBlank(text) {
   // judge null and underfined
   if (!text) {
     return true
   }
   // judge blank space
   if ((text.replace(/[ ]/g, '')).length === 0) {
     return true
   }
   return false
 }

 function isStrEmpty(text) {
   // judge null and underfined
   if (!text) {
     return true
   }
   if (text.length === 0) {
     return true
   }
   return false
 }

 module.exports = {
   isStrBlank: isStrBlank,
   isStrEmpty: isStrEmpty
 }