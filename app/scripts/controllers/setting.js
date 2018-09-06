'use strict';

/**
 * @ngdoc function
 * @name dmsAdminApp.controller:SettingctrlCtrl
 * @description
 * # SettingctrlCtrl
 * Controller of the dmsAdminApp
 */
angular.module('dmsAdminApp')
  .controller('SettingCtrl', function ($scope, $state, session, settings, $http, endpoint, profileservice, serviceservice, userservice, imageService, $timeout) {
    $scope.isStarted = false;
    $scope.settings = {};
    $scope.where = {};
    $scope.settings.primary_contact = {};
    $scope.settings.steps_completed_in_wizard = [];
    $scope.settings.secondary_contact = {};
    $scope.settings.invoice_contact = {};
    $scope.settings.contact_to_show_customer = {};
    $scope.settings.days_of_service = {};
    $scope.isCheckecdServiceData = false;
    $scope.isCheckedUserData == false;
    $scope.isLoder = false;
    $scope.isAddUser = true;
    $scope.donutValues = {};
    settings.getSetting({}, {}, function (data) {
      $scope.settings = data.body.setting || {};
      $scope.dummySettingsDetails = Object.assign({}, $scope.settings);
      $scope.man = $scope.settings.manufactur;
      // if ($scope.settings.finish_status == true) {
      //   $scope.isStarted = true;
      //   $scope.step = 1;
      //   $scope.complete = 1 - 1;
      // }
      $scope.selectmake = $scope.settings.make;
      $scope.donutValues = $scope.settings.donut_values;
      $scope.serverDountValues = Object.assign({}, $scope.settings.donut_values);
      $scope.settings.holidays = $scope.settings.holidays && $scope.settings.holidays.filter(onlyUnique);
      $scope.settings.steps_completed_in_wizard = $scope.settings.steps_completed_in_wizard || [];
      console.log("CURRENT STEP IN  WIZARD = ", $scope.settings.current_step_in_wizard)
      if ($scope.settings.current_step_in_wizard) {
        $scope.step = $scope.settings.current_step_in_wizard;
        $scope.complete = $scope.settings.current_step_in_wizard - 1;
      }
      else {
        console.log("CURRENT STEP IN  WIZARD = ", $scope.settings.current_step_in_wizard)
        $scope.isStarted = false;
      }
      if ($scope.settings.manufactur) {
        serviceservice.getMakesList({ id: $scope.settings.manufactur }, {}, function (data) {
          if (data.statusCode == 200) {
            $scope.makesList = data.body.makes;
          }
        });
      }
    });
    $scope.close = function () {
      // console.log('hi')
      $scope.already = null;
      $scope.alreadyc = null;
      $scope.alreadyu = null;
    }
    $scope.closeInvalidVinAlert = function () {
      // console.log('hi')
      $scope.already = null;
      $scope.alreadyc = null;
      $scope.invalidVinNum = null;
    }
    $scope.closeInvalidPhoneAlert = function () {
      // console.log('hi')
      $scope.already = null;
      $scope.alreadyc = null;
      $scope.invalidPhoneNum = null;
    }
    function updateTime() {
      $scope.close();
    }


    settings.getCurrentPlan({}, {}, function (data) {

      $scope.plans = data.body.plan;
    });
    $scope.$on('$viewContentLoaded', function () {
      $('ul.tabs').tabs();
      // $('.modal').modal();
      console.log('CONTENT LOADED')
    });
    $scope.selectTab = function (id) { $('ul.tabs').tabs('select_tab', id); };
    $scope.redirectPage = function (page) { $state.go(page); };

    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
    $scope.hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    $scope.updateSetting = function () {
      var validator = $("#formValidate").validate();
      if (!validator.form()) return;
      if ($scope.formValidate.$valid) {
        var tempPhone = $scope.profileData.phone;
        tempPhone = tempPhone.split("-").join("");
        if (isNaN(tempPhone) ||
          tempPhone.length !== 10) {
          Materialize.toast('<span> Please enter a valid phone no.</span>', 3000);
          return;
        }
        if ($scope.settings.manufactur != "5a3cbeb785b38502cad21b69") {
          if ($scope.selectmake.length == 0) {
            Materialize.toast('<span> Please select make.</span>', 3000);
            return;
          }
        }
        $scope.profileData.phone = tempPhone;
        $scope.profileData.manufactur = $scope.settings.manufactur;
        $scope.profileData.make = $scope.selectmake;
        $scope.settings.make = $scope.selectmake;

        profileservice.updateProfile({}, $scope.profileData, function (data) {
          $scope.profileData = data.body.user;
          $scope.settings.site_title = $scope.profileData.name;
          settings.updateSetting({}, $scope.settings, function (data) {
            if (data.statusText == 'success') {
              $scope.man = $scope.settings.manufactur;
              // $scope.site.site_title = $scope.settings.site_title;
              var message = data.message;
              $scope.isStarted = true;
              $scope.complete = 1;
              $scope.step = 2;
              $scope.updateSteps();
              $('html, body').animate({
                scrollTop: 0
              }, 'fast');
              // Materialize.toast('<span>' + message + '</span>', 3000);
            } else {
              var message = data.statusMessage;
              Materialize.toast('<span>' + message + '</span>', 3000);
            }
          });
        });
      }
      else {
        // angular.element(document.querySelector('#stepOne'))[0].click();
        Materialize.toast('<span> Please enter all fields.</span>', 3000);
      }
    }
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    var $picker = $('.datepickerholiday').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: 'Today',
      clear: 'Clear',
      min: true,
      close: 'Ok',
      closeOnSelect: true, // Close upon selecting a date,
      onSet: function (thingSet) {
        if (!thingSet.select) return;
        $scope.$apply(function () {
          var holidays = $scope.settings.holidays || [];
          holidays.push(thingSet.select);
          $scope.settings.holidays = holidays.filter(onlyUnique);
        })
      }
    });
    $scope.showCalender = function () { $picker.open(); };
    $scope.updateSetting1 = function () {
      if ($scope.formValidate1.$valid) {
        $scope.settings.holidays = $scope.settings.holidays && $scope.settings.holidays.length ?
          $scope.settings.holidays.filter(onlyUnique).map(function (item) { return new Date(item) }) : [];
        settings.updateSetting({}, $scope.settings, function (data) {
          if (data.statusText == 'success') {
            // $scope.site.site_title = $scope.settings.site_title;
            var message = data.message;
            $scope.isStarted = true;
            $scope.complete = 3;
            $scope.step = 4;
            $scope.updateSteps();
            // Materialize.toast('<span>' + message + '</span>', 3000);
          } else {
            var message = data.statusMessage;
            Materialize.toast('<span>' + message + '</span>', 3000);
          }
        });
      } else {
        angular.element(document.querySelector('#stepTwo'))[0].click();
        // Materialize.toast('<span> Please enter all fields.</span>', 3000);
      }
    }
    $scope.updateDonutValues = function () {
      if ($scope.dountFormValidate.$valid) {
        $scope.settings.donut_values = $scope.donutValues;
        console.log($scope.settings);
        settings.updateSetting({}, $scope.settings, function (data) {
          if (data.statusText == 'success') {
            // $scope.site.site_title = $scope.settings.site_title;
            var message = data.message;
            $scope.isStarted = true;
            $scope.complete = 5;
            $scope.step = 6;
            $scope.updateSteps();
            // Materialize.toast('<span>' + message + '</span>', 3000);
          } else {
            var message = data.statusMessage;
            Materialize.toast('<span>' + message + '</span>', 3000);
          }
        });
      }
    }

    $scope.deleteDountValues = function () {
      $scope.donutValues = $scope.serverDountValues;
      $scope.step = $scope.dummyStage;
      $scope.complete = $scope.dummyStage - 1;
      $scope.updateSteps();
      $('#modal9').closeModal({});
      setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
    }

    //here we need to do new manafacture and make logic
    // serviceservice.getManufactureList({}, {}, function (data) {
    //   if (data.statusCode == 200) {
    //     $scope.manufactureList = data.body.manufacture;
    //   }
    // });
    // $scope.changeManufacture = function () {
    //   console.log($scope.settings.manufactur)
    //   serviceservice.getMakesList({ id: $scope.settings.manufactur }, {}, function (data) {
    //     if (data.statusCode == 200) {
    //       $scope.makesList = data.body.makes;
    //     }
    //   });
    // }

  serviceservice.getNewManufactureList({}, {}, function (data) {
    if (data.statusCode == 200) {
      $scope.manufactureList = data.body.carlistDetails;
      $scope.changeManufacture = function (opt) {
        console.log(opt);
        $scope.tempMakesList = $scope.manufactureList.find(function (element) {
          if (element._id == opt) {
            return element.make;
          }
        });
        $scope.makesList = $scope.tempMakesList.make;
        console.log($scope.makesList);
      }
    }
  });

   $scope.selectmake = $scope.selectmake || [];
   $scope.changeMake = function (make) {
     console.log(make)
     if ($scope.selectmake.indexOf(make._id) === -1) {
       $scope.selectmake.push(make._id);
     } else {
       var posO = $scope.selectmake.indexOf(make._id);
       $scope.selectmake.splice(posO, 1)
     }
     console.log($scope.selectmake)
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
          data.body.result = data.body.result && data.body.result.length ? data.body.result.filter(function (item) { return item != null }) : [];
          $scope.services = data.body.result.length ? $scope.services.concat(data.body.result) : $scope.services;
          var add = 0;
          for (var i = 0; i < data.body.result.length; i++) {
            if (data.body.result[i] != null) add++;
          }
          // $timeout(updateTime, 10000);
          angular.element(document.querySelector('#serviceUploadForm'))[0].reset();
          Materialize.toast('<span>' + add + " Service items have been uploaded successfully!" + '</span>', 3000);
        } else {
          Materialize.toast('<span>' + 'Services adding has been failed' + '</span>', 3000);
        }
      })
    };
    $scope.saveAndContinue = function () {
      console.log('NEXT STEP', $scope.inCompletedStep);
      $('#next_confirmation_modal').closeModal();
      setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
      if ($scope.inCompletedStep === 7) {
        if ($scope.addServiceForm.$valid) $scope.addService(true);
        $('#formValidates').submit();
      }
      else if ($scope.inCompletedStep === 8) {
        if ($scope.addUsersForm.$valid) $scope.addUser(true);
        $('#addUsersForm').submit();
      }
      else if ($scope.inCompletedStep === 9) {
        if ($scope.addCustomerForm.$valid) $scope.addCustomer(true);
        $('#addCustomerForm').submit();
      }
    }
    $scope.getServices = function () {
      serviceservice.getServiceList({
      }, {}, function (data) {
        if (data.statusCode == 200) {
          $scope.serviceCount = data.body.count;
          $scope.services = data.body.services;
        }
      });
    };
    $scope.getUsers = function () {
      $scope.where['exclude_roles'] = 'user';
      userservice.getUserList($scope.where, {
      }, function (data) {
        if (data.statusCode == 200) {
          $scope.userCount = data.body.count;
          $scope.users = data.body.users;
          $scope.customerList = data.body.customers;
          $scope.customerCount = data.body.customerCount;
        }
      })
    };
    $scope.saveServiceDetails = function () {
      $('#modal2').closeModal({});
      setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
      if ($scope.addServiceForm.$valid) {
        $scope.serviceData.make = $scope.serviceData.make && $scope.serviceData.make.name != 'INDEPENDENT' ? $scope.serviceData.make.name : null;

        serviceservice.addBulkService({}, $scope.serviceData, function (data) {
          if (data.statusCode === 200) {
            data.body.result = data.body.result && data.body.result.length ? data.body.result.filter(function (item) { return item != null }) : [];
            $scope.services = data.body.result.length ? $scope.services.concat(data.body.result) : $scope.services;
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
            $scope.totalserve = 1;
            // $timeout(updateTime, 10000);
            angular.element(document.querySelector('#formValidates'))[0].reset();
            $scope.serviceData = [];
            $scope.isCheckecdServiceData = true;
            Materialize.toast('<span>' + add + " Service items have been uploaded successfully!" + '</span>', 3000);
            $scope.nextStep(7);
            //if (continueStep) $scope.nextStep($scope.inCompletedStep);
          } else {
            Materialize.toast('<span>' + data.message + '</span>', 3000);
          }
        })
      } else {
        Materialize.toast('<span> Add all fields</span>', 3000);
      }
    };
    $scope.cancelServiceDetails = function () {
      $('#modal2').closeModal({});
      setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
      $scope.serviceData = [];
      //$scope.nextStep(7);
    };
    $scope.gotoPreviousPage1 = function (stage) {
      $('#modal3').closeModal({});
      angular.element(document.querySelector('#addUsersForm'))[0].reset();
      //$scope.addUsersForm.$pristine = true;
      setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
      $scope.userData = [];
      $scope.step = stage;
      $scope.complete = stage - 1;
      $scope.updateSteps(true);
    };
    $scope.gotoPreviousPage2 = function (stage) {
      $('#modal15').closeModal({});
      angular.element(document.querySelector('#formValidate1'))[0].reset();
      //$scope.addUsersForm.$pristine = true;
      setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
      $scope.serviceData = [];
      $scope.step = stage;
      $scope.complete = stage - 1;
      $scope.updateSteps(true);
    };
    $scope.currentPage2 = function () {
      $('#modal3').closeModal({});
      setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
    };
    $scope.currentPage3 = function () {
      $('#modal15').closeModal({});
      setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
    };
    $scope.gotoPreviousPage5 = function (stage) {
      $('#modal5').closeModal({});
      setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
      $scope.step = stage;
      $scope.complete = stage - 1;
      $scope.serviceData = [];
      $scope.updateSteps();
    };
    $scope.currentPage6 = function () {
      $('#modal5').closeModal({});
      setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
    };
    $scope.gotoPreviousPage6 = function (stage) {
      $('#modal6').closeModal({});
      setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
      $scope.step = stage;
      $scope.complete = stage - 1;
      $scope.userData = [];
      $scope.customerData = [];
      $scope.updateSteps();
    };
    $scope.currentPage7 = function () {
      $('#modal8').closeModal({});
      setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
    };
    $scope.gotoDelaerInfo = function () {
      $('#modalSD').closeModal({});
      setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
      $scope.step = $scope.dummyStage;;
      $scope.complete = $scope.dummyStage; - 1;
      $scope.serviceData = [];
      $scope.customerData = [];
      $scope.userData = [];
      $scope.updateSteps();
    };
    $scope.currentServiceData = function () {
      $('#modalSD').closeModal({});
      setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
    };
    $scope.gotoAdviser = function (stage) {
      $('#modal16').closeModal({});
      setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
      $scope.step = stage;
      $scope.serviceData = [];
      $scope.complete = stage - 1;
      $scope.updateSteps();
    };
    $scope.currentServicePage = function () {
      $('#modal16').closeModal({});
      setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
    };
    $scope.gotoUserPage = function () {
      $('#modal17').closeModal({});
      $('#modal18').closeModal({});
      setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
      $scope.step = $scope.dummyStage;
      $scope.serviceData = [];
      $scope.customerData = [];
      $scope.complete = $scope.dummyStage - 1;
      $scope.updateSteps();
    };
    $scope.currentPage567 = function (num) {
      if (num == 6) {
        $('#modal17').closeModal({});
        setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
      } else {
        $('#modal18').closeModal({});
        setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
      }
    };
    $scope.saveUserData = function (stage) {
      $('#modal7').closeModal({});
      $scope.isLoder = true;
      $scope.isAddUser = false;
      setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
      if ($scope.addUsersForm.$valid || $scope.addCustomerForm.$valid) {
        var bulkData = $scope.userData.length > 0 ? $scope.userData : $scope.customerData;
        userservice.addBulkUser({}, bulkData, function (data) {
          if (data.statusCode === 200) {
            data.body.result = data.body.result && data.body.result.length ? data.body.result.filter(function (item) { return item != null }) : [];
            $scope.users = data.body.result.length ? $scope.users.concat(data.body.result) : $scope.users;
            console.log($scope.users)
            if (data.body.already.length != 0) {
              var string = '';
              for (var i = 0; i < data.body.already.length; i++) {
                string = data.body.already[i].name + ',' + string;
              }
              $scope.alreadyu = data.body.already;


            }
            if (data.body.availableVin.length != 0) {
              var stringVin = '';
              for (var i = 0; i < data.body.availableVin.length; i++) {
                stringVin = data.body.availableVin[i] + ',' + stringVin;
              }
              $scope.availableVinNum = data.body.availableVin;
            }
            if (data.body.invalidVinNumbers.length != 0) {
              var stringVin = '';
              for (var i = 0; i < data.body.invalidVinNumbers.length; i++) {
                stringVin = data.body.invalidVinNumbers[i] + ',' + stringVin;
              }
              $scope.invalidVinNum = data.body.invalidVinNumbers;
            }
            if (data.body.invalidPhoneNumbers.length != 0) {
              var stringPhone = '';
              for (var i = 0; i < data.body.invalidPhoneNumbers.length; i++) {
                stringPhone = data.body.invalidPhoneNumbers[i] + ',' + stringPhone;
              }
              $scope.invalidPhoneNum = data.body.invalidPhoneNumbers;
            }
            var add = 0;
            for (var i = 0; i < data.body.result.length; i++) {
              if (data.body.result[i] != null) add++;
            }
            $scope.totalusr = 1;
            $scope.totalcustomer = 1;
            // $timeout(updateTime, 10000);
            angular.element(document.querySelector('#addUsersForm'))[0].reset();
            if (data.body.isCustomer) {
              Materialize.toast('<span>' + data.body.createdUsers.length + " Users and " + data.body.createdVehicles.length + " Vehicles have been uploaded successfully!" + '</span>', 3000);
            } else {
              Materialize.toast('<span>' + data.body.createdUsers.length + " Users have been uploaded successfully!" + '</span>', 3000);
            }
            $scope.isLoder = false;
            $scope.isAddUser = true;
            $scope.userData = [];
            $scope.customerData = [];
            //Materialize.toast('<span>' + add + " Users have been uploaded successfully!" + '</span>', 3000);
            $scope.nextStep(8);
            //if (continueStep) $scope.nextStep($scope.inCompletedStep);
          }
          else {
            $scope.isLoder = false;
            $scope.isAddUser = true;
            Materialize.toast('<span>' + data.message + '</span>', 3000);
          }
        })
      } else {
        $scope.isLoder = false;
        $scope.isAddUser = true;
        Materialize.toast('<span> Add all fields</span>', 3000);
      }
    };
    $scope.closeUserDataPopup = function () {
      $('#modal7').closeModal({});
      setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
    };
    $scope.saveAndGoForAnotherPage = function (stage) {
      $('#modal8').closeModal({});
      setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
      if ($scope.step == 6) {
        if ($scope.addServiceForm.$valid) {
          $scope.serviceData.make = $scope.serviceData.make && $scope.serviceData.make.name != 'INDEPENDENT' ? $scope.serviceData.make.name : null;

          serviceservice.addBulkService({}, $scope.serviceData, function (data) {
            if (data.statusCode === 200) {
              data.body.result = data.body.result && data.body.result.length ? data.body.result.filter(function (item) { return item != null }) : [];
              $scope.services = data.body.result.length ? $scope.services.concat(data.body.result) : $scope.services;
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
              $scope.totalserve = 1;
              // $timeout(updateTime, 10000);
              angular.element(document.querySelector('#formValidates'))[0].reset();
              $scope.serviceData = [];
              $scope.isCheckecdServiceData = true;
              Materialize.toast('<span>' + add + " Service items have been uploaded successfully!" + '</span>', 3000);
              $scope.step = $scope.dummyStage;
              $scope.complete = $scope.dummyStage - 1;
              $scope.userData = [];
              $scope.customerData = [];
              $scope.updateSteps();
              //if (continueStep) $scope.nextStep($scope.inCompletedStep);
            } else {
              Materialize.toast('<span>' + data.message + '</span>', 3000);
            }
          })
        } else {
          Materialize.toast('<span> Add all fields</span>', 3000);
        }
      }
      if ($scope.step == 7) {
        $scope.isLoder = true;
        $scope.isAddUser = false;
        if ($scope.addUsersForm.$valid || $scope.addCustomerForm.$valid) {
          var bulkData = $scope.userData.length > 0 ? $scope.userData : $scope.customerData;
          userservice.addBulkUser({}, bulkData, function (data) {
            if (data.statusCode === 200) {
              data.body.result = data.body.result && data.body.result.length ? data.body.result.filter(function (item) { return item != null }) : [];
              $scope.users = data.body.result.length ? $scope.users.concat(data.body.result) : $scope.users;
              console.log($scope.users)
              if (data.body.already.length != 0) {
                var string = '';
                for (var i = 0; i < data.body.already.length; i++) {
                  string = data.body.already[i].name + ',' + string;
                }
                $scope.alreadyu = data.body.already;


              }
              if (data.body.availableVin.length != 0) {
                var stringVin = '';
                for (var i = 0; i < data.body.availableVin.length; i++) {
                  stringVin = data.body.availableVin[i] + ',' + stringVin;
                }
                $scope.availableVinNum = data.body.availableVin;
              }
              if (data.body.invalidVinNumbers.length != 0) {
                var stringVin = '';
                for (var i = 0; i < data.body.invalidVinNumbers.length; i++) {
                  stringVin = data.body.invalidVinNumbers[i] + ',' + stringVin;
                }
                $scope.invalidVinNum = data.body.invalidVinNumbers;
              }
              if (data.body.invalidPhoneNumbers.length != 0) {
                var stringPhone = '';
                for (var i = 0; i < data.body.invalidPhoneNumbers.length; i++) {
                  stringPhone = data.body.invalidPhoneNumbers[i] + ',' + stringPhone;
                }
                $scope.invalidPhoneNum = data.body.invalidPhoneNumbers;
              }
              var add = 0;
              for (var i = 0; i < data.body.result.length; i++) {
                if (data.body.result[i] != null) add++;
              }
              $scope.totalusr = 1;
              $scope.totalcustomer = 1;
              // $timeout(updateTime, 10000);
              angular.element(document.querySelector('#addUsersForm'))[0].reset();
              $scope.userData = [];
              $scope.customerData = [];
              if (data.body.isCustomer) {
                Materialize.toast('<span>' + data.body.createdUsers.length + " Users and " + data.body.createdVehicles.length + " Vehicles have been uploaded successfully!" + '</span>', 3000);
              } else {
                Materialize.toast('<span>' + data.body.createdUsers.length + " Users have been uploaded successfully!" + '</span>', 3000);
              }
              $scope.isLoder = false;
              $scope.isAddUser = true;
              $scope.step = $scope.dummyStage;
              $scope.complete = $scope.dummyStage - 1;
              $scope.updateSteps();
              //if (continueStep) $scope.nextStep($scope.inCompletedStep);
            }
            else {
              $scope.isLoder = false;
              $scope.isAddUser = true
              Materialize.toast('<span>' + data.message + '</span>', 3000);
            }
          })
        } else {
          $scope.isLoder = false;
          $scope.isAddUser = true
          Materialize.toast('<span> Add all fields</span>', 3000);
        }
      }

    };
    $scope.closeThePopup = function (num) {
      if (num == 8) {
        $('#modal8').closeModal({});
        setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
      } else {
        $('#modal9').closeModal({});
        setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
      }
    };
    $scope.getServices();
    $scope.getUsers();
    $scope.nextStep = function (stage, skip) {
      console.log('STEPS COMPLETED =', $scope.settings.steps_completed_in_wizard)
      console.log('STEP  =', stage)
      $scope.isStarted = true;
      $scope.dummyStage = stage;
      $scope.inCompletedStep = stage;//marking step as incomplete
      if (stage == 1) {
        if (($scope.step == 2 && stage == 1)) {
          if ($scope.addUsersForm.uname0.$valid || $scope.addUsersForm.lname0.$valid || $scope.addUsersForm.uemail0.$valid || $scope.addUsersForm.uphone0.$valid) {
            $('#modalSD').openModal({});
          } else {
            $scope.step = stage;
            $scope.complete = stage - 1;
            $scope.userData = [];
            $scope.updateSteps();
          }
        }
        else if (($scope.step == 3 && stage == 1) || ($scope.step == 4 && stage == 1)) {
          $scope.step = stage;
          $scope.complete = stage - 1;
          $scope.updateSteps();
        } else if (($scope.step == 6 && stage == 1) || ($scope.step == 7 && stage == 1)) {
          if ($scope.step == 6 && stage == 1) {
            if (($scope.addServiceForm.name0.$valid || $scope.addServiceForm.des0.$valid || $scope.addServiceForm.amount0.$valid)) {
              $('#modalSD').openModal({});
            } else {
              $scope.step = stage;
              $scope.complete = stage - 1;
              $scope.updateSteps();
            }
          }
          if ($scope.step == 7 && stage == 1) {
            if (($scope.addCustomerForm.uname0.$valid || $scope.addCustomerForm.lname0.$valid || $scope.addCustomerForm.uemail0.$valid || $scope.addCustomerForm.address0.$valid
              || $scope.addCustomerForm.phone0.$valid || $scope.addCustomerForm.vin0.$valid)) {
              $('#modalSD').openModal({});
            } else {
              $scope.step = stage;
              $scope.complete = stage - 1;
              $scope.updateSteps();
            }
          }
        } else if (stage == 1 && $scope.step == 5) {
          if (($scope.dountFormValidate.$dirty)) {
            $('#modal9').openModal({});
          } else {
            $scope.step = stage;
            $scope.complete = stage - 1;
            $scope.updateSteps();
          }
        } else {
          $scope.step = stage;
          $scope.complete = stage - 1;
          $scope.updateSteps();
        }
      } else if ((stage == 3 && $scope.step == 2 && $scope.addUsersForm.$valid == true)) {
        Materialize.toast('<span>Please complete Step 2.</span>', 3000);
      } else if (stage == 2 && $scope.complete == 0) {
        if ($scope.settings.steps_completed_in_wizard.indexOf(1) === -1) {
          Materialize.toast('<span>Please complete Step 1.</span>', 3000);
          return;
        }
        $scope.updateSetting();
      } else if (stage == 2 && $scope.step == 3) {
        $scope.settings = $scope.dummySettingsDetails;
        $scope.step = stage;
        $scope.complete = stage - 1;
        $scope.updateSteps();
      }
      else if (stage == 3 && $scope.complete == 1 && skip) {
        $scope.inCompletedStep = null;
        $scope.step = stage;
        $scope.complete = stage - 1;
        $scope.updateSteps();
      }
      else if (stage == 3 && $scope.complete == 1) {
        if ($scope.settings.steps_completed_in_wizard.indexOf(1) === -1) {
          Materialize.toast('<span>Please complete Step 1.</span>', 3000);
          return;
        }
        if ($scope.settings.steps_completed_in_wizard.indexOf(2) === -1) {
          Materialize.toast('<span>Please complete Step 2.</span>', 3000);
          return;
        }
        $scope.updateSetting1();
      } else if ((stage == 3 && $scope.step == 6) || (stage == 4 && $scope.step == 6) || (stage == 5 && $scope.step == 6)) {
        if (($scope.addServiceForm.name0.$valid || $scope.addServiceForm.des0.$valid || $scope.addServiceForm.amount0.$valid)) {
          $('#modalSD').openModal({});
        } else {
          $scope.step = stage;
          $scope.complete = stage - 1;
          $scope.updateSteps();
        }
      }
      else if (stage == 7) {
        if ($scope.serviceData.length == 0) {
          if ($scope.settings.steps_completed_in_wizard.indexOf(1) === -1) {
            Materialize.toast('<span>Please complete Step 1.</span>', 3000);
            return;
          }
          if ($scope.settings.steps_completed_in_wizard.indexOf(2) === -1) {
            Materialize.toast('<span>Please complete Step 2.</span>', 3000);
            return;
          }
          serviceservice.getServiceList({}, {}, function (data) {
            if (data.statusCode == 200) {
              $scope.serviceCount = data.body.count;
              if ($scope.serviceCount == 0) {
                Materialize.toast('<span>' + 'Please add at-least 1 service item to proceed.' + '</span>', 3000);
                // $scope.confirmationText = 'The Service items you have added are not saved.';
                // $('#next_confirmation_modal').openModal();
                return;
              }
              // $('#next_confirmation_modal').closeModal({});
              // setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
              $scope.inCompletedStep = null;
              $scope.step = stage;
              $scope.complete = stage - 1;
              $scope.updateSteps();
            }
          })
        } else {
          $('#modal2').openModal({});
        }
      }
      else if (stage == 8) {
        if ($scope.userData.length == 0) {
          if ($scope.settings.steps_completed_in_wizard.indexOf(1) === -1) {
            Materialize.toast('<span>Please complete Step 1.</span>', 3000);
            return;
          }
          if ($scope.settings.steps_completed_in_wizard.indexOf(2) === -1) {
            Materialize.toast('<span>Please complete Step 2.</span>', 3000);
            return;
          }
          $scope.where['exclude_roles'] = 'user';
          userservice.getUserList($scope.where, function (data) {
            if (data.statusCode == 200) {
              $scope.userCount = data.body.count;
              $scope.customerList = data.body.customers;
              $scope.customerCount = data.body.customerCount;
              if ($scope.userCount == 0) {
                Materialize.toast('<span>' + 'Please add at-least 1 user to proceed.' + '</span>', 3000);
                return;
              }
              // $('#next_confirmation_modal').closeModal({});
              // setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
              $scope.inCompletedStep = null;
              $scope.step = stage;
              $scope.complete = stage - 1;
              $scope.updateSteps();
            }
          })
        } else {
          if ($scope.addUsersForm.$valid) {
            $('#modal7').openModal({});
          } else {
            Materialize.toast('<span>' + 'Please fill the required field.' + '</span>', 3000);
          }
        }
      }
      else if ((stage == 2 && $scope.step == 6) || (stage == 2 && $scope.step == 7)) {
        if ($scope.step == 6 && stage == 2) {
          if (($scope.addServiceForm.name0.$valid || $scope.addServiceForm.des0.$valid || $scope.addServiceForm.amount0.$valid)) {
            $('#modal17').openModal({});
          } else {
            $scope.step = stage;
            $scope.complete = stage - 1;
            $scope.updateSteps();
          }
        }
        if ($scope.step == 7 && stage == 2) {
          if (($scope.addCustomerForm.uname0.$valid || $scope.addCustomerForm.lname0.$valid || $scope.addCustomerForm.uemail0.$valid || $scope.addCustomerForm.address0.$valid
            || $scope.addCustomerForm.phone0.$valid || $scope.addCustomerForm.vin0.$valid)) {
            $('#modal18').openModal({});
          } else {
            $scope.step = stage;
            $scope.complete = stage - 1;
            $scope.updateSteps();
          }
        }
      }
      else if ((stage == 3 && $scope.step == 6) || (stage == 3 && $scope.step == 7)) {
        if ($scope.step == 6 && stage == 3) {
          if (($scope.addServiceForm.name0.$valid || $scope.addServiceForm.des0.$valid || $scope.addServiceForm.amount0.$valid)) {
            $('#modal8').openModal({});
          } else {
            $scope.step = stage;
            $scope.complete = stage - 1;
            $scope.updateSteps();
          }
        }
        if ($scope.step == 7 && stage == 3) {
          if (($scope.addCustomerForm.uname0.$valid || $scope.addCustomerForm.lname0.$valid || $scope.addCustomerForm.uemail0.$valid || $scope.addCustomerForm.address0.$valid
            || $scope.addCustomerForm.phone0.$valid || $scope.addCustomerForm.vin0.$valid)) {
            $('#modalSD').openModal({});
          } else {
            $scope.step = stage;
            $scope.complete = stage - 1;
            $scope.updateSteps();
          }
        }
      }
      else if ((stage == 4 && $scope.step == 6) || (stage == 4 && $scope.step == 7)) {
        if ($scope.step == 6 && stage == 4) {
          if (($scope.addServiceForm.name0.$valid || $scope.addServiceForm.des0.$valid || $scope.addServiceForm.amount0.$valid)) {
            $('#modal8').openModal({});
          } else {
            $scope.step = stage;
            $scope.complete = stage - 1;
            $scope.updateSteps();
          }
        }
        if ($scope.step == 7 && stage == 4) {
          if (($scope.addCustomerForm.uname0.$valid || $scope.addCustomerForm.lname0.$valid || $scope.addCustomerForm.uemail0.$valid || $scope.addCustomerForm.address0.$valid
            || $scope.addCustomerForm.phone0.$valid || $scope.addCustomerForm.vin0.$valid)) {
            $('#modalSD').openModal({});
          } else {
            $scope.step = stage;
            $scope.complete = stage - 1;
            $scope.updateSteps();
          }
        }
      }
      else if ((stage == 5 && $scope.step == 6 && skip == undefined) || (stage == 5 && $scope.step == 7 && skip == undefined)) {
        if ($scope.step == 6 && stage == 5 && skip == undefined) {
          if (($scope.addServiceForm.name0.$valid || $scope.addServiceForm.des0.$valid || $scope.addServiceForm.amount0.$valid)) {
            $('#modal16').openModal({});
          } else {
            $scope.step = stage;
            $scope.complete = stage - 1;
            $scope.updateSteps();
          }
        }
        if ($scope.step == 7 && stage == 5 && skip == undefined) {
          if (($scope.addCustomerForm.uname0.$valid || $scope.addCustomerForm.lname0.$valid || $scope.addCustomerForm.uemail0.$valid || $scope.addCustomerForm.address0.$valid
            || $scope.addCustomerForm.phone0.$valid || $scope.addCustomerForm.vin0.$valid)) {
            $('#modalSD').openModal({});
          } else {
            $scope.step = stage;
            $scope.complete = stage - 1;
            $scope.updateSteps();
          }
        }
      }
      else if ((stage == 6 && skip == true) || (stage == 6 && $scope.step == 7)) {
        if ($scope.step == 7 && stage == 6) {
          if (($scope.addCustomerForm.uname0.$valid || $scope.addCustomerForm.lname0.$valid || $scope.addCustomerForm.uemail0.$valid || $scope.addCustomerForm.address0.$valid
            || $scope.addCustomerForm.phone0.$valid || $scope.addCustomerForm.vin0.$valid)) {
            $('#modalSD').openModal({});
          } else {
            $scope.step = stage;
            $scope.complete = stage - 1;
            $scope.updateSteps();
          }
        }
        if (stage == 6 && skip == true) {
          if (($scope.addCustomerForm.uname0.$valid || $scope.addCustomerForm.lname0.$valid || $scope.addCustomerForm.uemail0.$valid || $scope.addCustomerForm.address0.$valid
            || $scope.addCustomerForm.phone0.$valid || $scope.addCustomerForm.vin0.$valid)) {
            $('#modal6').openModal({});
          } else {
            $scope.step = stage;
            $scope.complete = stage - 1;
            $scope.updateSteps();
          }
        }
      }
      else if ((stage == 4 && $scope.step == 5) || (stage == 3 && $scope.step == 5) || (stage == 2 && $scope.step == 5)) {
        if ($scope.dountFormValidate.$pristine == false) {
          $('#modal9').openModal({});
        } else {
          $scope.step = stage;
          $scope.complete = stage - 1;
          $scope.updateSteps();
        }
      }
      else if (stage == 5 && skip == true) {
        if (($scope.addServiceForm.name0.$valid || $scope.addServiceForm.des0.$valid || $scope.addServiceForm.amount0.$valid)) {
          $('#modal5').openModal({});
        } else {
          $scope.step = stage;
          $scope.complete = stage - 1;
          $scope.updateSteps();
        }
      }
      // else if (stage == 9) {
      //   console.log('Customer DATA', stage, $scope.userData.length, skip);
      //   if ($scope.customerData.length && !skip) {
      //     $scope.confirmationText = 'The Customers you have added are not saved.';
      //     $('#next_confirmation_modal').openModal();
      //     return;
      //   }
      //   $('#next_confirmation_modal').closeModal({});
      //   setTimeout(function () { $('.lean-overlay').hide(); }, 1000);
      //   $scope.inCompletedStep = null;
      //   $scope.step = stage;
      //   $scope.complete = stage - 1;
      // }
      else {
        if ($scope.settings.steps_completed_in_wizard.indexOf(1) === -1) {
          Materialize.toast('<span>Please complete Step 1.</span>', 3000);
          return;
        }
        if ($scope.settings.steps_completed_in_wizard.indexOf(2) === -1) {
          Materialize.toast('<span>Please complete Step 2.</span>', 3000);
          return;
        }
        if (stage == 3) $scope.clearImage();

        $scope.step = stage;
        $scope.complete = stage - 1;
        $scope.updateSteps();
      }
      $('html, body').animate({
        scrollTop: 0
      }, 'fast');
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


    $scope.crop = function () {
      if ($scope.validImage) {
        $scope.image_temp = $scope.myCroppedImage;
        var byteString = atob($scope.myCroppedImage.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        var blob = new Blob([ia], { type: 'image/png' });
        blob.lastModifiedDate = new Date();
        blob.lastModifiedDate = new Date();
        $scope.blob = blob;
        $scope.fileName = "a.png";
        $scope.blobUrl = URL.createObjectURL(blob);
        $scope.showCroppedImg = true;

      } else {
        Materialize.toast('<span> Upload valid image </span>', 3000);
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
    $scope.finalStep = function () {
      $scope.step = 1;
      $scope.complete = 1 - 1;
      Materialize.toast('<span>Congrats! your dealership is setup. </span>', 3000);
    }

    var rolesLookup = {
      'marketing_manager': 'MM',
      'used_car_manager': 'UCM',
      'service_scheduler': 'SS',
      'service_adviser': 'SA',
      'vehicle​_inspection​': 'VI',
      'admin': 'ADMIN',
      'user': 'USER'
    };
    $scope.printRoles = function (roles) {

      var rolesArray = [];
      if (roles) {
        roles.forEach(function (item) {
          rolesArray.push(rolesLookup[item]);
        });
      }
      rolesArray = rolesArray.filter(function (item) { return item != null && item != undefined && item != false })
      return rolesArray.length === 0 ? 'N/A' : rolesArray.join(",");
    }
    $scope.primeToSecondary = function () {
      $scope.settings.secondary_contact = {};
      angular.copy($scope.settings.primary_contact, $scope.settings.secondary_contact);
    }
    $scope.primeToSecondary1 = function () {
      $scope.settings.contact_to_show_customer = {};
      angular.copy($scope.settings.secondary_contact, $scope.settings.contact_to_show_customer);
    }
    $scope.totalserve = 1;
    $scope.addservicediv = function () {
      $scope.totalserve = $scope.totalserve + 1;
    }
    $scope.removeservicediv = function ($index) {
      $scope.totalserve = $scope.totalserve - 1;
      $scope.serviceData.splice($index, 1);
    }
    $scope.serviceData = [];
    $scope.addService = function (continueStep) {
      if ($scope.addServiceForm.$valid) {
        $scope.serviceData.make = $scope.serviceData.make && $scope.serviceData.make.name != 'INDEPENDENT' ? $scope.serviceData.make.name : null;

        serviceservice.addBulkService({}, $scope.serviceData, function (data) {
          if (data.statusCode === 200) {
            data.body.result = data.body.result && data.body.result.length ? data.body.result.filter(function (item) { return item != null }) : [];
            $scope.services = data.body.result.length ? $scope.services.concat(data.body.result) : $scope.services;
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
            $scope.totalserve = 1;
            // $timeout(updateTime, 10000);
            angular.element(document.querySelector('#formValidates'))[0].reset();
            $scope.serviceData = [];
            $scope.isCheckecdServiceData = true;
            Materialize.toast('<span>' + add + " Service items have been uploaded successfully!" + '</span>', 3000);
            if (continueStep) $scope.nextStep($scope.inCompletedStep);
          } else {
            Materialize.toast('<span>' + data.message + '</span>', 3000);
          }
        })
      } else {
        Materialize.toast('<span> Add all fields</span>', 3000);
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
          data.body.result = data.body.result && data.body.result.length ? data.body.result.filter(function (item) { return item != null }) : [];
          $scope.users = data.body.result.length ? $scope.users.concat(data.body.result) : $scope.users;
          var add = 0;
          for (var i = 0; i < data.body.result.length; i++) {
            if (data.body.result[i] != null) add++;
          }
          // $timeout(updateTime, 10000);
          angular.element(document.querySelector('#userUploadForm'))[0].reset();
          Materialize.toast('<span>' + add + " Users have been uploaded successfully!" + '</span>', 3000);
        } else {
          Materialize.toast('<span>' + 'User adding has been failed' + '</span>', 3000);
        }
      })
    };
    $scope.totalusr = 1;
    $scope.adduserdiv = function () {
      $scope.totalusr = $scope.totalusr + 1;
    }
    $scope.removuserdiv = function ($index) {
      $scope.totalusr = $scope.totalusr - 1;
      $scope.userData.splice($index, 1);
    }
    $scope.totalcustomer = 1;
    $scope.addcustomerdiv = function () {
      $scope.totalcustomer = $scope.totalcustomer + 1;
    }
    $scope.removcustomerdiv = function ($index) {
      $scope.totalcustomer = $scope.totalcustomer - 1;
      $scope.customerData.splice($index, 1);
    }
    $scope.closeVinAlert = function () {
      // console.log('hi')
      $scope.already = null;
      $scope.alreadyc = null;
      $scope.availableVinNum = null;
    }
    $scope.userData = [];
    $scope.customerData = [];
    $scope.addUser = function (continueStep) {
      $scope.isLoder = true;
      $scope.isAddUser = false;
      if ($scope.addUsersForm.$valid || $scope.addCustomerForm.$valid) {
        var isRoles = [];
        if ($scope.userData.length > 0) {
          $scope.userData.map(function (item) {
            if (item.roles == undefined) {
              isRoles.push(item);
            }
          });
        }
        if (isRoles.length == 0) {
          var bulkData = $scope.userData.length > 0 ? $scope.userData : $scope.customerData;
          userservice.addBulkUser({}, bulkData, function (data) {
            if (data.statusCode === 200) {
              // $scope.userList = data.body.result ? $scope.userList.concat(data.body.result) : $scope.userList;
              $scope.getUsers();
              if (data.body.already.length != 0) {
                var string = '';
                for (var i = 0; i < data.body.already.length; i++) {
                  string = data.body.already[i].name + ',' + string;
                }
                $scope.alreadyu = data.body.already;
              }
              if (data.body.availableVin.length != 0) {
                var stringVin = '';
                for (var i = 0; i < data.body.availableVin.length; i++) {
                  stringVin = data.body.availableVin[i] + ',' + stringVin;
                }
                $scope.availableVinNum = data.body.availableVin;
              }
              if (data.body.invalidVinNumbers.length != 0) {
                var stringVin = '';
                for (var i = 0; i < data.body.invalidVinNumbers.length; i++) {
                  stringVin = data.body.invalidVinNumbers[i] + ',' + stringVin;
                }
                $scope.invalidVinNum = data.body.invalidVinNumbers;
              }
              if (data.body.invalidPhoneNumbers.length != 0) {
                var stringPhone = '';
                for (var i = 0; i < data.body.invalidPhoneNumbers.length; i++) {
                  stringPhone = data.body.invalidPhoneNumbers[i] + ',' + stringPhone;
                }
                $scope.invalidPhoneNum = data.body.invalidPhoneNumbers;
              }
              var add = 0;
              for (var i = 0; i < data.body.result.length; i++) {
                if (data.body.result[i] != null) add++;
              }
              $scope.totalusr = 1;
              $scope.totalcustomer = 1;
              // $timeout(updateTime, 10000);
              angular.element(document.querySelector('#addUsersForm'))[0].reset();
              $scope.userData = [];
              $scope.customerData = [];
              if (data.body.isCustomer) {
                Materialize.toast('<span>' + data.body.createdUsers.length + " Users and " + data.body.createdVehicles.length + " Vehicles have been uploaded successfully!" + '</span>', 3000);
              } else {
                Materialize.toast('<span>' + data.body.createdUsers.length + " Users have been uploaded successfully!" + '</span>', 3000);
              }
              $scope.isLoder = false;
              $scope.isAddUser = true;
              if (continueStep) $scope.nextStep($scope.inCompletedStep);
            }
            else {
              $scope.isLoder = false;
              $scope.isAddUser = true;
              Materialize.toast('<span>' + data.message + '</span>', 3000);
            }
          });
        } else {
          $scope.isLoder = false;
          $scope.isAddUser = true;
          Materialize.toast('<span> Please enter roles.</span>', 3000);
        }
      } else {
        $scope.isLoder = false;
        $scope.isAddUser = true;
        Materialize.toast('<span> Add all fields</span>', 3000);
      }
    }

    $scope.roles = [
      { name: "admin", role: "admin" },
      { name: "marketing_manager", role: "MM" },
      { name: "used_car_manager", role: "UCM" },
      { name: "service_scheduler", role: "SS" },
      { name: "service_adviser", role: "SA" },
      { name: "vehicle​_inspection​", role: "VI" }
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
          for (var i = 0; i < data.body.result.length; i++) {
            if (data.body.result[i] != null) add++;
          }
          // $timeout(updateTime, 10000);
          angular.element(document.querySelector('#customerUploadForm'))[0].reset();
          Materialize.toast('<span>' + add + " Customers have been uploaded successfully!" + '</span>', 3000);
        } else {
          Materialize.toast('<span>' + 'Customer adding has been failed' + '</span>', 3000);
        }
      })
    };
    $scope.totalcus = 1;
    $scope.addcustomerdiv = function () {
      $scope.totalcus = $scope.totalcus + 1;
    }
    $scope.removcustomerdiv = function ($index) {
      $scope.totalcus = $scope.totalcus - 1;
      $scope.customerData.splice($index, 1);
    }
    $scope.customerData = [];
    $scope.addCustomer = function () {
      $scope.isLoder = true;
      $scope.isAddUser = false;
      if ($scope.addCustomerForm.$valid) {
        userservice.addBulkUser({}, $scope.customerData, function (data) {
          if (data.statusCode === 200) {
            if (data.body.already.length != 0) {
              var string = '';
              for (var i = 0; i < data.body.already.length; i++) {
                string = data.body.already[i].name + ',' + string;
              }
              $scope.alreadyc = data.body.already;

            }
            if (data.body.availableVin.length != 0) {
              var stringVin = '';
              for (var i = 0; i < data.body.availableVin.length; i++) {
                stringVin = data.body.availableVin[i] + ',' + stringVin;
              }
              $scope.availableVinNum = data.body.availableVin;
            }
            if (data.body.invalidVinNumbers.length != 0) {
              var stringVin = '';
              for (var i = 0; i < data.body.invalidVinNumbers.length; i++) {
                stringVin = data.body.invalidVinNumbers[i] + ',' + stringVin;
              }
              $scope.invalidVinNum = data.body.invalidVinNumbers;
            }
            if (data.body.invalidPhoneNumbers.length != 0) {
              var stringPhone = '';
              for (var i = 0; i < data.body.invalidPhoneNumbers.length; i++) {
                stringPhone = data.body.invalidPhoneNumbers[i] + ',' + stringPhone;
              }
              $scope.invalidPhoneNum = data.body.invalidPhoneNumbers;
            }
            var add = 0;
            for (var i = 0; i < data.body.result.length; i++) {
              if (data.body.result[i] != null) add++;
            }
            $scope.totalcus = 1;
            // $timeout(updateTime, 10000);
            angular.element(document.querySelector('#addCustomerForm'))[0].reset();
            $scope.customerData = [];
            if (data.body.isCustomer) {
              Materialize.toast('<span>' + data.body.createdUsers.length + " Users and " + data.body.createdVehicles.length + " Vehicles have been uploaded successfully!" + '</span>', 3000);
            } else {
              Materialize.toast('<span>' + data.body.createdUsers.length + " Users have been uploaded successfully!" + '</span>', 3000);
            }
            //Materialize.toast('<span>' + add + " Customers have been uploaded successfully!" + '</span>', 3000);
          }
          else {
            $scope.isLoder = false;
            $scope.isAddUser = true;
            Materialize.toast('<span>' + data.message + '</span>', 3000);
          }
        })
      } else {
        $scope.isLoder = false;
        $scope.isAddUser = true;
        Materialize.toast('<span> Add all fields</span>', 3000);
      }
    }
    $scope.logout = function () { session.destroy('accesstoken'); $state.go('login'); };


    // $scope.selectmake = $scope.selectmake || [];
    // $scope.changeMake = function (make) {
    //   console.log(make)
    //   if ($scope.selectmake.indexOf(make._id) === -1) {
    //     $scope.selectmake.push(make._id);
    //   } else {
    //     var posO = $scope.selectmake.indexOf(make._id);
    //     $scope.selectmake.splice(posO, 1)
    //   }
    //   console.log($scope.selectmake)
    // }
    $scope.setFlag = function () {
      $scope.settings.finish_status = true;
      settings.updateSetting({}, $scope.settings, function (data) {
        if (data.statusText == 'success') {
          $scope.man = $scope.settings.manufactur;
          // $scope.site.site_title = $scope.settings.site_title;
          var message = data.message;
          $scope.isStarted = true;
          $scope.complete = 0;
          $scope.step = 1;
          $scope.updateSteps();
          // Materialize.toast('<span>' + message + '</span>', 3000);
        } else {
          var message = data.statusMessage;
          Materialize.toast('<span>' + message + '</span>', 3000);
        }
      });
    }

    $scope.updateSteps = function (checkedBoolean) {
      var completedSteps = Array.from({ length: ($scope.complete + 1) }, function (x, i) { return i });
      settings.updateSetting({}, {
        completed_step: completedSteps,
        incomplete_step: $scope.step,
        _id: $scope.settings._id,
        dealer: $scope.settings.dealer
      }, function (data) {
        if (data.statusCode == 200) {
          console.log('STEPS UPDATED')
          //$scope.settings = data.body.setting;
          if (checkedBoolean == undefined) {
            $scope.serverDountValues = Object.assign({}, data.body.setting.donut_values);
            $scope.settings.steps_completed_in_wizard = data.body.setting.steps_completed_in_wizard;
            $scope.tempSettings = JSON.parse(JSON.stringify($scope.settings));
          } else {
            $scope.settings = $scope.tempSettings;
          }

        }
      });
    };
  })
  .directive('dayBox', function () {
    return {
      restrict: 'E',
      scope: {
        day: '=',
        label: '@',
        hours: '='
      },
      templateUrl: './views/day.html',
      link: function (scope, elem, attr) {
      }
    };
  });