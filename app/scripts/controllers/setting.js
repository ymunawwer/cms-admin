'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:SettingctrlCtrl
 * @description
 * # SettingctrlCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('SettingCtrl', function ($scope, $state, session, settings, $http, endpoint, profileservice, serviceservice, userservice, imageService, $interval) {
    $scope.isStarted = false;
    $scope.settings = {};
    $scope.settings.primary_contact = {};
    $scope.settings.secondary_contact = {};
    $scope.settings.invoice_contact = {};
    $scope.settings.contact_to_show_customer = {};
    settings.getSetting({}, {}, function (data) {
      $scope.settings = data.body.setting;
      if ($scope.settings.manufactur) {
        serviceservice.getMakesList({ id: $scope.settings.manufactur }, {}, function (data) {
          if (data.statusCode == 200) {
            $scope.makesList = data.body.makes;
          }
        });
      }
    });
    $scope.$on('$viewContentLoaded', function () { $('ul.tabs').tabs(); });
    $scope.selectTab = function (id) { $('ul.tabs').tabs('select_tab', id); };
    $scope.redirectPage = function (page) { $state.go(page); };
   
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
    $scope.hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    $scope.updateSetting = function () {
      if ($scope.formValidate.$valid) {
        var tempPhone = $scope.profileData.phone;
        tempPhone = tempPhone.split("-").join("");
        if (isNaN(tempPhone) ||
          tempPhone.length !== 10) {
          Materialize.toast('<span> Please enter a valid phone no.</span>', 3000);
          return;
        }
        $scope.profileData.phone= tempPhone;
        $scope.profileData.manufactur = $scope.settings.manufactur;
        $scope.profileData.make = $scope.settings.make;
        profileservice.updateProfile({}, $scope.profileData, function (data) {
          $scope.profileData = data.body.user;
          $scope.settings.site_title = $scope.profileData.name;
          settings.updateSetting({}, $scope.settings, function (data) {
            if (data.statusText == 'success') {
              // $scope.site.site_title = $scope.settings.site_title;
              var message = data.message;
              $scope.isStarted = true;
              $scope.complete = 1;
              $scope.step = 2;
              // Materialize.toast('<span>' + message + '</span>', 3000);
            } else {
              var message = data.statusMessage;
              Materialize.toast('<span>' + message + '</span>', 3000);
            }
          });
        });
      }
    }
    $scope.updateSetting1 = function () {
      if ($scope.formValidate1.$valid) {

        settings.updateSetting({}, $scope.settings, function (data) {
          if (data.statusText == 'success') {
            // $scope.site.site_title = $scope.settings.site_title;
            var message = data.message;
            $scope.isStarted = true;
            $scope.complete = 2;
            $scope.step = 3;
            // Materialize.toast('<span>' + message + '</span>', 3000);
          } else {
            var message = data.statusMessage;
            Materialize.toast('<span>' + message + '</span>', 3000);
          }
        });
      }
    }
    serviceservice.getManufactureList({}, {}, function (data) {
      if (data.statusCode == 200) {
        $scope.manufactureList = data.body.manufacture;
      }
    });
    $scope.changeManufacture = function () {
      console.log($scope.settings.manufactur)
      serviceservice.getMakesList({ id: $scope.settings.manufactur }, {}, function (data) {
        if (data.statusCode == 200) {
          $scope.makesList = data.body.makes;
        }
      });
    }
    $scope.uploadFile = function (files) {
      var fd = new FormData();
      //Take the first selected file
      fd.append("site_logo", files[0]);
      fd.append("_id", $scope.settings._id);
      settings.updateImage({}, fd, function (data) {
        if (data.statusText == 'success') {
          $scope.settings.site_logo.url = data.body.setting.site_logo.url;
          var message = data.message;
          Materialize.toast('<span>' + 'Image Uploaded Successfully' + '</span>', 3000);
        } else {
          var message = data.statusMessage;
          Materialize.toast('<span>' + 'Image Uploading failed!' + '</span>', 3000);
        }
      })
    };
    $scope.profileData = {};

    profileservice.getProfileData({}, {}, function (data) {
      if (data.statusCode === 200) {
        $scope.profileData = data.body.user;
      }
    });

    $scope.changePassword = function () {
      profileservice.changePassword({}, $scope.changepassword, function (data) {
        if (data.statusCode === 200) {
          $scope.changepassword.old_password = '';
          $scope.changepassword.password = '';
          $scope.changepassword.cpassword = '';
          Materialize.toast('<span>' + data.message + '</span>', 3000);
        }
        else {
          Materialize.toast('<span>' + data.message + '</span>', 3000);
        }
      });
    }
    $scope.updateProfile = function () {
      profileservice.updateProfile({}, $scope.profileData, function (data) {
        if (data.statusCode === 200) {
          $scope.profileData = data.body.user;
          $scope.admin.name = $scope.profileData.name;
          Materialize.toast('<span>' + data.message + '</span>', 3000);
        }
      });
    }

  
    //function to clear uploaded image 
    $scope.clearImage = function () {
      $scope.showCroppedImg = false;
      $scope.myImage = null;
      $scope.validImage = false;
      angular.element(document.querySelector('#imageForm'))[0].reset();
      $("#fileInput").val = '';
    }
   
    $scope.close = function () {
      // console.log('hi')
      $scope.already = null;
      $scope.alreadyc = null;
      $scope.alreadyu = null;
    }
    function updateTime() {
      $scope.close();
    }
    $interval(updateTime, 10000);

    $scope.uploadServiceData = function (files) {
      var fd = new FormData();
      //Take the first selected file
      fd.append("file", files[0]);

      serviceservice.uploadServiceFile({}, fd, function (data) {
        if (data.statusText == 'success') {
          if (data.body.already.length != 0) {
            var string = '';
            for (var i = 0; i < data.body.already.length; i++) {
              string = data.body.already[i].name + ',' + string;
            }
            $scope.already = data.body.already;

          }
          var add = 0;
          for (var i = 0; i < data.body.result.length; i++) {
            if (data.body.result[i] != null) add++;
          }
          angular.element(document.querySelector('#serviceUploadForm'))[0].reset();
          Materialize.toast('<span>' + add + " Service items have been uploaded successfully!" + '</span>', 3000);
        } else {
          Materialize.toast('<span>' + 'Services adding has been failed' + '</span>', 3000);
        }
      })
    };

   
    $scope.nextStep = function (stage) {
      $scope.isStarted = true;
      $scope.step = stage;
      $scope.complete = stage - 1;
      if(stage==3){
        $scope.clearImage();
      }
    }

    imageService.getImage({}, {}, function (data) {
      console.log(data);
      if (data.statusCode == 200) {
        $scope.imageList = data.body.images;
        if ($scope.imageList.length == 0)
          $scope.addImg = true;
        else
          $scope.viewImg = true;
      }
    })

    $scope.deleteRemove = function (id, index) {
      console.log(id, index);
      imageService.deleteImage({ id: id }, {}, function (data) {
        if (data.statusCode === 200) {
          $scope.imageList.splice(index, 1);
        }
        else {
          Materialize.toast('<span>' + data.message + '</span>', 3000);
        }
      })
    }

    $scope.myImage = '';
    $scope.myCroppedImage = '';
    $scope.cropType = "square";
    $scope.validImage = false;
    $scope.showCroppedImg = false;

    var handleFileSelect = function (evt) {
      var valu = evt.currentTarget.files[0].type;
      var patt = new RegExp("image/");
      if (patt.test(valu)) {
        angular.element('#img_cropper').children('canvas').css('display', 'block');
        $('#upload_block').css('display', 'none');
        $('.cropArea').css('display', 'block');
        $('.image_cropped').css('display', 'inline-block');
        angular.element('#image_type').css('display', 'none');

        var file = evt.currentTarget.files[0];
        var reader = new FileReader();

        var output = document.getElementById("result");

        reader.onload = function (evt) {
          $scope.$apply(function ($scope) {
            $scope.myImage = evt.target.result;
            $scope.validImage = true;
          });
          angular.element('#image_type').css('display', 'none');
        };
        reader.readAsDataURL(file);
        $("#fileInput").val = '';
      } else {
        $scope.validImage = false;
        angular.element('#image_type').css('display', 'block');
      }
    };
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);

    var mimeType = "image/jpeg"

    function urltoFile(url, filename, mimeType) {
      return (fetch(url).then(function (res) {
        return res.arrayBuffer();
      }).then(function (buf) {
        return new File([buf], filename, { type: mimeType });
      }));
    }

   
    $scope.crop = function() {
      if ($scope.validImage) {
        $scope.image_temp = $scope.myCroppedImage;

        var byteString = atob($scope.myCroppedImage.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ia], {type: 'image/png'});

        blob.lastModifiedDate = new Date();
        blob.lastModifiedDate = new Date();
        $scope.blob = blob;
        $scope.fileName = "a.png";

        $scope.blobUrl = URL.createObjectURL(blob);

        $scope.showCroppedImg = true;

      } else {
        Materialize.toast('<span>' +
          "Upload valid image" +
          '</span>',
        3000);
      }
    }

    $scope.addImages = function () {
      if ($scope.validImage) {
        if ($scope.showCroppedImg) {
          var fd = new FormData();
          fd.append("picture", $scope.blob, $scope.fileName);
          fd.append("for", 'offer');

          imageService.uploadImage({}, fd, function (data) {
            if (data.statusCode === 200) {
              $scope.clearImage()
      $scope.viewImg = true;
      $scope.addImg = false;
              Materialize.toast('<span>' + data.message + '</span>', 3000);
              imageService.getImage({}, {}, function (data) {
                if (data.statusCode == 200) {
                  $scope.imageList = data.body.images;
                  if ($scope.imageList.length == 0)
                    $scope.addImg = true;
                  else
                    $scope.viewImg = true;
                }
              })
            }
            else {
              Materialize.toast('<span>' + data.message + '</span>', 3000);
            }
          })
        }
        else {
          Materialize.toast('<span>' + "Crop image" + '</span>', 3000);
        }
      }
      else {
        Materialize.toast('<span>' + "Add a valid image" + '</span>', 3000);
      }
    }
    $scope.viewImage = function () {
      $scope.clearImage()
      $scope.viewImg = true;
      $scope.addImg = false;
    }
    $scope.addImage = function () {
      $scope.clearImage();
      $scope.viewImg = false;
      $scope.addImg = true;
    }
    $scope.finalStep = function(){
      $scope.step = 1;
      $scope.complete = 1 - 1;
      Materialize.toast('<span>Congrats! your dealership is setup.  </span>', 3000);
    }
    

    $scope.primeToSecondary = function(){
      $scope.settings.secondary_contact ={};
      if($scope.secondCheck)
      {
        $scope.settings.secondary_contact.name = $scope.settings.primary_contact.name;
        $scope.settings.secondary_contact.title = $scope.settings.primary_contact.title
        $scope.settings.secondary_contact.email = $scope.settings.primary_contact.email
        $scope.settings.secondary_contact.phone = $scope.settings.primary_contact.phone
      }
      else {
        $scope.settings.secondary_contact.name = $scope.settings.secondary_contact.name
        $scope.settings.secondary_contact.title = $scope.settings.secondary_contact.title
        $scope.settings.secondary_contact.email = $scope.settings.secondary_contact.email
        $scope.settings.secondary_contact.phone = $scope.settings.secondary_contact.phone
      }
      
    }
    $scope.primeToSecondary1 = function(){
      $scope.settings.contact_to_show_customer ={};
      if($scope.secondCheck1)
      {
        $scope.settings.contact_to_show_customer.name = $scope.settings.invoice_contact.name;
        $scope.settings.contact_to_show_customer.address = $scope.settings.invoice_contact.address
        $scope.settings.contact_to_show_customer.email = $scope.settings.invoice_contact.email
        $scope.settings.contact_to_show_customer.phone = $scope.settings.invoice_contact.phone
        $scope.settings.contact_to_show_customer.website = $scope.settings.invoice_contact.website
      }
      else {
        $scope.settings.contact_to_show_customer.name = $scope.settings.contact_to_show_customer.name
        $scope.settings.contact_to_show_customer.address = $scope.settings.contact_to_show_customer.address
        $scope.settings.contact_to_show_customer.email = $scope.settings.contact_to_show_customer.email
        $scope.settings.contact_to_show_customer.phone = $scope.settings.contact_to_show_customer.phone;
        $scope.settings.contact_to_show_customer.website = $scope.settings.contact_to_show_customer.website
      }
      
    }
    $scope.totalserve = 1;
    $scope.addservicediv = function(){
      $scope.totalserve = $scope.totalserve+1;
    }
    $scope.removeservicediv = function(){
      $scope.totalserve = $scope.totalserve-1;
    }
    $scope.serviceData = [];
    $scope.addService = function () {
      if($scope.addServiceForm.$valid) {
        $scope.serviceData.make = $scope.serviceData.make && $scope.serviceData.make.name != 'INDEPENDENT' ? $scope.serviceData.make.name : null;

        serviceservice.addBulkService({}, $scope.serviceData, function (data) {
          if (data.statusCode === 200) {
            if (data.body.already.length != 0) {
              var string = '';
              for (var i = 0; i < data.body.already.length; i++) {
                string = data.body.already[i].name + ',' + string;
              }
              $scope.already = data.body.already;
  
            }
            var add = 0;
            for (var i = 0; i < data.body.result.length; i++) {
              if (data.body.result[i] != null) add++;
            }
            $scope.totalserve =1;
            angular.element(document.querySelector('#formValidates'))[0].reset();
            Materialize.toast('<span>' + add + " Service items have been uploaded successfully!" + '</span>', 3000);
          } else {
            Materialize.toast('<span>' + data.message + '</span>', 3000);
          }
        })
      }
    }

    $scope.uploadUserData = function (files) {
      var fd = new FormData();
      //Take the first selected file
      fd.append("file", files[0]);

      userservice.uploadUserFile({}, fd, function (data) {
        if (data.statusText == 'success') {
          if (data.body.already.length != 0) {
            var string = '';
            for (var i = 0; i < data.body.already.length; i++) {
              string = data.body.already[i].name + ',' + string;
            }
            $scope.alreadyu = data.body.already;

          }
          var add = 0;
          for(var i=0;i<data.body.result.length; i++){
            if(data.body.result[i]!=null) add++;
          }
          angular.element(document.querySelector('#userUploadForm'))[0].reset();
          Materialize.toast('<span>' + add + " Users have been uploaded successfully!" + '</span>', 3000);
        } else {
          Materialize.toast('<span>' + 'User adding has been failed' + '</span>', 3000);
        }
      })
    };
    $scope.totalusr = 1;
    $scope.adduserdiv = function(){
      $scope.totalusr = $scope.totalusr+1;
    }
    $scope.removuserdiv = function(){
      $scope.totalusr = $scope.totalusr-1;
    }
    $scope.userData = [];
    $scope.addUser = function(){
      
      if($scope.addUsersForm.$valid){
        userservice.addBulkUser({}, $scope.userData, function(data){
          if(data.statusCode === 200){
            if (data.body.already.length != 0) {
              var string = '';
              for (var i = 0; i < data.body.already.length; i++) {
                string = data.body.already[i].name + ',' + string;
              }
              $scope.alreadyu = data.body.already;
  
            }
            var add = 0;
            for(var i=0;i<data.body.result.length; i++){
              if(data.body.result[i]!=null) add++;
            }
            $scope.totalusr = 1;
            angular.element(document.querySelector('#addUsersForm'))[0].reset();
            Materialize.toast('<span>' + add + " Users have been uploaded successfully!" + '</span>', 3000);
          }
          else{
            Materialize.toast('<span>'+data.message+'</span>', 3000);
          }
        })
      }else{
        Materialize.toast('<span> Add all fields</span>', 3000);
      }
    }

    $scope.roles = [ 
      {name:"admin", role:"admin"},
    {name:"marketing_manager", role:"MM"},
    {name:"used_car_manager",role:"UCM"},
    {name:"service_scheduler",role:"SS"},
    {name:"service_adviser", role:"SA"},
    {name:"vehicle​_inspection​", role:"VI"}
  ];

  $scope.uploadCustomerData = function (files) {
    var fd = new FormData();
    //Take the first selected file
    fd.append("file", files[0]);

    userservice.uploadUserFile({}, fd, function (data) {
      if (data.statusText == 'success') {
        if (data.body.already.length != 0) {
          var string = '';
          for (var i = 0; i < data.body.already.length; i++) {
            string = data.body.already[i].name + ',' + string;
          }
          $scope.alreadyc = data.body.already;

        }
        var add = 0;
        for(var i=0;i<data.body.result.length; i++){
          if(data.body.result[i]!=null) add++;
        }
        angular.element(document.querySelector('#customerUploadForm'))[0].reset();
        Materialize.toast('<span>' + add + " Customers have been uploaded successfully!" + '</span>', 3000);
      } else {
        Materialize.toast('<span>' + 'Customer adding has been failed' + '</span>', 3000);
      }
    })
  };
  $scope.totalcus = 1;
  $scope.addcustomerdiv = function(){
    $scope.totalcus = $scope.totalcus+1;
  }
  $scope.removcustomerdiv = function(){
    $scope.totalcus = $scope.totalcus-1;
  }
  $scope.customerData = [];
  $scope.addCustomer = function(){
      
    if($scope.addCustomerForm.$valid){
      userservice.addBulkUser({}, $scope.customerData, function(data){
        if(data.statusCode === 200){
          if (data.body.already.length != 0) {
            var string = '';
            for (var i = 0; i < data.body.already.length; i++) {
              string = data.body.already[i].name + ',' + string;
            }
            $scope.alreadyc = data.body.already;

          }
          var add = 0;
          for(var i=0;i<data.body.result.length; i++){
            if(data.body.result[i]!=null) add++;
          }
          $scope.totalcus =1;
          angular.element(document.querySelector('#addCustomerForm'))[0].reset();
          Materialize.toast('<span>' + add + " Customers have been uploaded successfully!" + '</span>', 3000);
        }
        else{
          Materialize.toast('<span>'+data.message+'</span>', 3000);
        }
      })
    }else{
      Materialize.toast('<span> Add all fields</span>', 3000);
    }
  }
  });

