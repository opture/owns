/* exported StorageAdapter */
/* global  _ */
function BaseStore(options) {
    riot.observable(this);
    var adapter = this;

    //var adapter = {};
    //Tells if there has been a call to fetch a collection, either remotely or locally.
    adapter.collectionIsLoading = false;

    adapter.newStart = true;

    //Set for how long data is considered to be fresh, makes a new request after this time.
    adapter.validHours= options.validHours || 168;
    
    //Keeps the collection of items.
    adapter.collection = options.collection || [];
    
    //The type of the individual items in the collection.
    adapter.modelType = options.modelType || function () { };
    
    //Setts the name of the modelcollection, used internally to store in localstorage.
    adapter.modelName = options.modelName || 'NONAME';
    
    //Set the models id field to enable us to retreive items based on this property.
    adapter.modelIdField = options.modelIdField || '';
    
    //Sets the remote url to fetch a colleciton of item.
    adapter.remoteUrlCollection = options.remoteUrlCollection || '';
    
    //Set the remote url to fetch items by id
    adapter.remoteUrlById = options.remoteUrlById || '';
    
    //Override function for successful received data from remote.
    adapter.remoteFetchSuccess = options.remoteFetchSuccess || adapter.getItemsSuccess;
    
    //Function to execute if remotereceived failed.
    adapter.remoteFetchFail = options.remoteFetchFail || function () { };
    
    //Default function to sort received data.
    adapter.defaultSortFunction = options.defaultSortFunction || function () { };
    
    //Default function to filter only wanted records
    adapter.defaultFilterFunction = options.defaultFilterFunction || function () { return true;};
    
    //Wrapper propertyname for collection received from remote.
    adapter.collectionWrapper = options.collectionWrapper || null;
    
    //wrapper propertyname for objects received from remote.
    adapter.objectWrapper = options.objectWrapper || null;
    
    //Options for remote call as object.
    adapter.remoteOptions = options.remoteOptions || {};
    
    //Append to url ie: webben7.se/api/lunch/[2015-02-27]
    adapter.remoteAppendUrl = options.remoteAppendUrl || null;
    //function for updated element.
    adapter.collectionItemUpdated = options.collectionItemUpdated || function (item) {
        console.log('Collection Item updates' + item);
        adapter.trigger(adapter.modelName + '_collection_item_updated');
    };
    //Event to trigger when collection changes
    adapter.on(adapter.modelName + '_list_init', function(){
        console.log(adapter.modelName + '_list_init');
        adapter.getCollection();
    });

    //Returns the collection sorted based on the defaultSortFunction.
    adapter.sortedCollection = function (sortFunction, filterFunction) {
        sortFunction = sortFunction || adapter.defaultSortFunction;
        filterFunction = sortFunction || adapter.defaultFilterFunction;
        var sortedCopy = adapter.collection.slice();
        sortedCopy.sort(sortFunction);
        //sortedCopy = sortedCopy.filter(adapter.defaultFilterFunction);
        return sortedCopy;
    };

    //Fetch multiple items from collection.
    //Inputs: idArray: array of ids to fetch, callback: function to run on completion.
    adapter.getByIds = function (idArray, callback) {
        //Get single elements from an array of ids, and returns an array.
        var localCallback;
        var retval = [];
        //Callback function for each id in the array.
        //when we have got as many callbacks as there were ids in the array we are done.
        localCallback = function (data) {
            retval.push(data);
            //callback(retval);
            if ($('#loadCounter').length === 0) {
                $('#loaderOverlay').append($('<div style="color:white;background:red;width:50%;margin:0 auto;position:relative;top:75%;"  id="loadCounter" >Laddat: ' + retval.length + ' företag</div>'));
            } else {
                $('#loadCounter').html('Laddat ' + retval.length + ' av ' + idArray.length);
            }
            
            console.log(retval.length);
            if (retval.length === idArray.length) {
                $('#loadCounter').remove();
                retval.sort(adapter.defaultSortFunction);
                callback(retval);
            }
        };
        for (var i = 0; i<idArray.length;i++) {
            adapter.getById(idArray[i], localCallback);
        }
    };

    //Return a single item by Id.
    //
    adapter.getById = function (id, callback) {
        callback = callback || function () { };
        //First load the collection..
        adapter.getCollection(function (coll, updated) {
            if (updated) { return; }
            if (adapter.collection[id]) {
                console.log('its saved!');
                callback(adapter.collection[id]);
                return adapter.collection[id];
            } else {
                //get remotely.
                adapter.getByIdRemote(id, function (item) {
                    callback(item);
                    return item;
                });
            }
        }, false, true);

    };

    //Fetcha single item remotely by id
    adapter.getByIdRemote = function (id, callback) {
        console.log('get remote by id');
        // var query = {

        // };
        // query = $.extend(query, adapter.remoteOptions);
        $.ajax({
            dataType: 'json',
            data: adapter.remoteOptions,
            url: adapter.remoteUrlCollection + '/' + id,
            success: function (data) {
                //reset remoteOptions.
                //adapter.remoteOptions = {};
                //var retVal = adapter.getItemsSuccess(data);
                callback(adapter.collection[data[adapter.modelIdField]]);
                adapter.storeCollectionLocal();
            }
        });

    };

    //Get a collection either, if there is something in localstorage get it then fetch remotely.
    adapter.getCollection = function (callback, forceRemote) {
        console.log('load collection');
        //Check if we are busy loading already.
        console.log('is loading: ' + adapter.collectionIsLoading);
        if (adapter.collectionIsLoading) {
            console.log('something is still loading');
            //Wait for the collection to load... 
            // setTimeout(function () {
            //     adapter.getCollection(callback);
            // }, 1500);
            // return;
        }
        adapter.collectionIsLoading = true;
        var localStored = false;
        if (forceRemote) {
            //Force remote loading.
            //First try to get  possible local stored collection.
            //adapter.getCollectionLocal(callback, false);
            //The make a remote call and tell the callback to update the DOM.
            console.log('force remote fetching: ' + adapter.modelName)
            //adapter.getCollectionRemote(callback, false);
            adapter.collectionIsLoading = false;
            return;
        }
        //Already loaded into memory.
        if (adapter.collection.length > 0) {
            console.log('we got something in memory...');
            //console.log(adapter.collection);
            adapter.collectionIsLoading = false;
            //callback(adapter.sortedCollection(), false);
            //adapter.getCollectionLocal(callback, true);
            //RiotControl.trigger(adapter.modelName + '_collection_changed', adapter.collection);
            if (adapter.newStart){
                console.log('new start');
                adapter.newStart = false;
                adapter.getCollectionRemote(callback, true);
            }
            return;
        }
        //Get from localstorage
        localStored = adapter.getCollectionLocal(callback);
        if (localStored) { adapter.collectionIsLoading = false; }

        //Not loaded and not localstored.
        adapter.getCollectionRemote(callback);
        adapter.collectionIsLoading = false;
        //adapter.trigger(adapter.modelName + '_collection_updated');
    };

    //Get a local collection, if it fails fetch it remotely.
    adapter.getCollectionLocal = function (callback, update) {
        callback = callback || function () { };
        console.log('load collection locally');
        //Load a collection from localstorage.
        var localStoredCollection = window.localStorage.getItem(adapter.modelName);
        var parsedCollection;

        //If there are nothing stored local return false.
        if (!localStoredCollection) { 
            console.log('Nothing stored');
            return false; 
        }

        //Check if its toooo old data, then make a remote call and update the old data.
        parsedCollection = JSON.parse(localStoredCollection);
        adapter.getItemsSuccess(parsedCollection.collection);
        // if (!parsedCollection.dateStored || new Date(parsedCollection.dateStored) < new Date().addHours(adapter.validHours*-1)) {
        //     console.log('too old');
        //     return false;
        // } else {
        //     //Data is not too old, make the callback, but still make a background remote call and update the data...
        //     console.log('local callback;');
        //     adapter.getItemsSuccess(parsedCollection.collection);
        //     console.log('local callback;');
        //     adapter.collectionIsLoading = false;
        //     callback(adapter.sortedCollection(), update);
            
        //     return true;
        // }
        //callback(adapter.sortedCollection(), update);
        adapter.trigger(adapter.modelName + '_collection_changed', adapter.collection);
        //adapter.getCollectionRemote();
        return true;
    };

    //Call for remote data.
    adapter.getCollectionRemote = function (callback, update) {
        console.log('load collection remotely: ' + update);
        callback = callback || function () { };
        // var query = {
        // };
        // query = $.extend(query, adapter.remoteOptions);
        $.ajax({
            url: adapter.remoteUrlCollection + (adapter.remoteAppendUrl != undefined  ? "/" + adapter.remoteAppendUrl[0] : ''),
            dataType: 'json',
            data: adapter.remoteOptions,
            success: function (data) {
                console.log('received remote');
                //Clear collection
                adapter.collection = [];
                //Is there a wrapper for the collection.
                if (adapter.collectionWrapper && data[adapter.collectionWrapper] !== null){
                    console.log('collection wrapped with: ' + adapter.collectionWrapper);
                    adapter.getItemsSuccess(data[adapter.collectionWrapper]);    
                }else{
                    adapter.getItemsSuccess(data);
                }

                //We received data and we are happy say we are rady for new loading.
                adapter.collectionIsLoading = false;
                //callback(adapter.sortedCollection(), update);
                adapter.trigger(adapter.modelName + '_collection_changed', adapter.collection);
                //Store this to the local collection.
                adapter.storeCollectionLocal();               
            },
            error: function (xhr) {
                //adapter.remoteOptions = {};
                console.log('error fetching remote collection ' + adapter.modelType);
                console.log(xhr.responseText);
                adapter.collectionIsLoading = false;
                //callback(adapter.sortedCollection(), update);
                return false;
            }
        });
    };

    //Run this upon successful retreival of categories.
    adapter.getItemsSuccess = function (data) {
        var curNode = {};
        if (!Array.isArray(data)) { data = [].concat(data); }
        if (!data) { return; }
        
        for (var i = 0;i < data.length;i++) {
            if (adapter.objectWrapper && data[i][adapter.objectWrapper] !== undefined){
                console.log('object wrapped with: ' + adapter.objectWrapper);
                curNode = data[i][adapter.objectWrapper];
            }else{
                curNode = data[i];
            }
            if (curNode) {
                //does it exist in current array already-

                if (adapter.modelIdField.length <= 0) {
                    console.log('no modelid');
                    //Insert at position i in collection.
                    adapter.collection[i] = new adapter.modelType(curNode);
                    //RiotControl.trigger(adapter.modelName + '_collection_changed', adapter.collection);

                } else if (!adapter.isInCollection(curNode)) {
                    //Add a item to the collection
                    //console.log('adding item: ' + curNode[adapter.modelIdField]);
                    var newItem = new adapter.modelType(curNode)
                    adapter.collection.push(newItem);
                    adapter.trigger(adapter.modelName + '_item_added', newItem);
                } else {
                    //This updates an item in the collection.
                    //console.log('updating item: ' + curNode[adapter.modelIdField]);
                    var updateItem = new adapter.modelType(curNode);
                    adapter.collection.push(updateItem);
                    adapter.trigger(adapter.modelName + '_item_updated', updateItem);
                }
            }
        }
    };

    //Store the collection locally
    adapter.storeCollectionLocal = function () {
        window.localStorage.setItem(adapter.modelName, JSON.stringify({ collection: adapter.collection, dateStored: new Date() }));
    };

    adapter.isInCollection = function(obj){
        var curObj = _.find(adapter.collection, function(item){ 
            return item[adapter.modelIdField] === obj[adapter.modelIdField];
        });
        if (!curObj) {
            return false;
        }
        return true;
    };
    return adapter;
}