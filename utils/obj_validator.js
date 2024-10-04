module.exports = {
    validateObjectId,
  };
  
  /**
   * 
   * @param {*} id
   * @return {Boolean}
   */
  function validateObjectId(id) {  
    const checkObjectIdFormat = new RegExp('^[0-9a-fA-F]{24}$');
    return checkObjectIdFormat.test(id);
  };
  