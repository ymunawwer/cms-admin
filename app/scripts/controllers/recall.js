'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:RecallCtrl
 * @description
 * # RecallCtrl
 * Controller of the dmsAdminApp
 */
'use strict';

angular.module('dmsAdminApp').controller('RecallCtrl', function ($scope, serviceservice, session, $state) {

  $scope.rlimit = 10;
  $scope.where = {};
  $scope.rstart = 0;
  $scope.rpage = 1;
  $scope.where['limit'] = $scope.rlimit
  $scope.where['skip'] = $scope.rstart
  serviceservice.getRecall($scope.where, {}, function (data) {
    if (data.statusCode === 200) {
      $scope.recalls = data.body.recall;
      $scope.recallCount = data.body.count;
      $scope.rtotalPages = Math.ceil($scope.recallCount / $scope.rlimit);
    } else {
      Materialize.toast('<span>' + data.message + '</span>', 3000);
    }
  })
  $scope.$watch('searchVin', function (newValue, oldValue) {
    $scope.rlimit = 10;
    $scope.rstart = 0;
    $scope.rpage = 1;
    $scope.where['limit'] = $scope.rlimit
    $scope.where['skip'] = $scope.rstart
    if (newValue == '') {
      session.destroy('keyvalue')
      serviceservice.getRecall($scope.where, {}, function (data) {
        if (data.statusCode == 200) {
          $scope.recalls = data.body.recall;
          $scope.recallCount = data.body.count;
          $scope.rtotalPages = Math.ceil($scope.recallCount / $scope.rlimit);
        }
      })
    }
    if (newValue && newValue.length >= 1) {
      session.set('keyvalue', newValue)
      serviceservice.getRecallsSearch({
        limit: $scope.llimit,
        skip: $scope.lstart,
        key: newValue,
      }, {}, function (data) {
        if (data.statusCode == 200) {
          $scope.recalls = data.body.recall;
          $scope.recallCount = data.body.count;
          $scope.rtotalPages = Math.ceil($scope.recallCount / $scope.rlimit);
        }
      })
    }
  });
  $scope.recallpaginate = function (page) {
    console.log(page);
    if (page == 0 || $scope.rtotalPages < page)
      return false;

    $scope.rstart = page * $scope.rlimit - $scope.rlimit;
    $scope.rlimit = 10;
    $scope.rpage = page;
    serviceservice.getRecallsSearch({
      key: session.get('keyvalue'),
      limit: $scope.rlimit,
      skip: $scope.rstart
    }, {}, function (data) {
      if (data.statusCode == 200) {
        $scope.recalls = data.body.recall;
        $scope.recallCount = data.body.count;
        $scope.rtotalPages = Math.ceil($scope.recallCount / $scope.rlimit);
      }
    })
  }
  //  serviceservice.getRecallLookup({},{}, function(data) {
  //    if (data.statusCode === 200) {
  //      $scope.lookuprecalls = data.body.recall;
  //    } else {
  //      Materialize.toast('<span>' + data.message + '</span>', 3000);
  //    }
  //  })

  $scope.loading = false;
  $scope.addRecall = function () {
    $scope.loading = true;
    serviceservice.addRecall({}, $scope.recallData, function (data) {
      if (data.statusCode === 200) {
        Materialize.toast('<span>' + data.message + '</span>', 3000);
        $state.go('home.recallview');
      } else {
        Materialize.toast('<span>' + data.message + '</span>', 3000);
      }
      $scope.loading = false;
    })
  }
  $scope.recallData = {};
  $scope.checkVins = function () {
    if (!$scope.recallData.vin) {
      alert('please enter vin number');
      return false;
    }
    serviceservice.getVehicles({
        vin: $scope.recallData.vin
      }, {},
      function (res) {
        var data = res.body;
        if (res.statusCode === 200) {
          if (data.count == 0) {
            Materialize.toast('<span>' + $scope.recallData.vin + ' this vin not found</span>', 3000);
            $scope.recallData.vin = '';
          } else {
            $scope.recallData.vehicle_id = data.vehicle[0].vehicle_id;
          }
        }
        // Materialize.toast('<span>' + res.message + '</span>', 3000);
      })
  };

  $scope.addRecallLookup = function () {
    serviceservice.addRecallLookup({}, $scope.recallData, function (data) {
      if (data.statusCode === 200) {
        $scope.recallData = {};
        Materialize.toast('<span>' + data.message + '</span>', 3000);
        //  $location.path('recall/view')
      } else {
        Materialize.toast('<span>' + data.message + '</span>', 3000);
      }
    })
  }
  $scope.uploadFileRecall = function (files) {
    var fd = new FormData();
    //Take the first selected file
    fd.append("file", files[0]);

    serviceservice.uploadServiceFileRecall({}, fd, function (data) {
      if (data.statusText == 'success') {
        if (data.body.already.length != 0) {
          var string = '';
          for (var i = 0; i < data.body.already.length; i++) {
            string = data.body.already[i].name + ',' + string;
          }
          $scope.already = data.body.already;
        }
        Materialize.toast('<span> Recall added Successfully </span>', 3000);
      } else {
        Materialize.toast('<span> Recall adding has been failed </span>', 3000);
      }
    })
  };
  $scope.uploadFileLookUp = function (files) {
    var fd = new FormData();
    //Take the first selected file
    fd.append("file", files[0]);

    serviceservice.uploadServiceFileRecallLookUp({}, fd, function (data) {
      if (data.statusText == 'success') {
        if (data.body.already.length != 0) {
          var string = '';
          for (var i = 0; i < data.body.already.length; i++) {
            string = data.body.already[i].name + ',' + string;
          }
          $scope.already = data.body.already;

        }
        Materialize.toast('<span>Recall added Successfully</span>', 3000);
      } else {
        Materialize.toast('<span>Recall adding has been failed</span>', 3000);
      }
    })
  };

  $scope.openPopUp = function (item) {
    console.log(item);
    $scope.item = item;
    $('.modal').openModal();
  }

  $scope.deleteItem = function (id, index) {
    serviceservice.deleteRecall({
      id: id
    }, {}, function (data) {
      if (data.statusCode === 200) {
        $scope.recalls.splice(index, 1);
      } else {
        Materialize.toast(data.message, 3000);
      }
      console.log(data);
    })
  }
  $scope.recallrange = function () {
    var rangeSize = 5;
    var ret = [];
    var start;

    start = $scope.rpage;
    if (start > $scope.rtotalPages - rangeSize) {
      start = $scope.rtotalPages - rangeSize + 1;
    }

    for (var i = start; i < start + rangeSize; i++) {
      if (i > 0)
        ret.push(i);
    }
    return ret;
  };


});
