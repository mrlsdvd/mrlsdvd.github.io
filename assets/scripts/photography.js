$().ready(function() {
   /**
    * Begin with desired content as default
    */
    // Load config data
    var obj = JSON.parse(JSON.stringify('/config.json'))
    console.log("Photography page loaded!")
    console.log(obj.photography)

});