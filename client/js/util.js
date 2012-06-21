define(function() {

    return {
        load: function(url, callback) {
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function() {
                if (xhr.readyState < 4) {
                    return;
                }

                if (xhr.status !== 200) {
                    return;
                }

                if (xhr.readyState === 4) {
                    callback(xhr.responseText);
                }
            };

            xhr.open('GET', url, true);
            xhr.send('');

        }
    };

});
