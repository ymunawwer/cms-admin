'use strict';

describe('Service: imageService', function () {

  // load the service's module
  beforeEach(module('dmsAdminApp'));

  // instantiate service
  var imageService;
  beforeEach(inject(function (_imageService_) {
    imageService = _imageService_;
  }));

  it('should do something', function () {
    expect(!!imageService).toBe(true);
  });

});
