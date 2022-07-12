module.exports =  {
    multipleMongose : function (array) {
         return array.map(item=> item.toObject());
    },
    mongoseToObject : function (array) {
        return array ? array.toObject() : array;
    }
 };