(function (angular) {
	'use strict';

	function dynamicDCSController($scope, $state, dynMsgService, authService, alertService, $uibModal) {
		_.set(this, 'startPage', '/dynamic-dcs.tpl.html');
		_.set($scope, 'auth', authService);
		_.set($scope, 'animationsEnabled', true);

		_.set($scope, 'alertService', alertService);

		_.set($scope, 'openSettingsModal', function (size) {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: '/apps/dynamic-dcs/common/modals/settings/settingsModal.tpl.html',
				controller: 'settingsModalController',
				controllerAs: 'setCtrl',
				size: size
			});
			modalInstance.result
				.then(function (selectedItem) {
					console.log('setSel',selectedItem);
				}, function () {
					console.log('Modal dismissed at: ' + new Date());
				});
		});
		_.set($scope, 'openAdminModal', function (size) {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: '/apps/dynamic-dcs/common/modals/admin/adminModal.tpl.html',
				controller: 'adminModalController',
				controllerAs: 'adminCtrl',
				size: size,
				resolve: {
					DDCSServers: [
						'dynamic-dcs.api.server', function (api) {
							return api.query()
								.$promise
								.then(function (response) {
									return response;
								})
								.catch(function () {
									return [];
								})
								;
						}
					]
				}
			});
			modalInstance.result
				.then(function (selectedItem) {
					console.log('adminSel',selectedItem);
				}, function () {
					console.log('Modal dismissed at: ' + new Date());
				});
		});

		$scope.initialise = function() {

			_.set($scope, 'isCollapsed', true);
			_.set($scope, 'go', function(state) {
				$state.go(state);
			});
			_.set($scope, 'tabData', [
				{
					heading: 'Leaderboard',
					route:   'index'
				},
				{
					heading: 'DynamicCaucasus',
					route:   'dynCaucasus'
				},
				{
					heading: 'DynamicRedDawn',
					route:   'dynRedDawn'
				}
			]);
			_.set($scope, 'cObj', _.get(dynMsgService, 'cObj'));
		};

		$scope.initialise();
	}
	dynamicDCSController.$inject = ['$scope','$state', 'dynMsgService', 'authService', 'alertService', '$uibModal'];

	function settingsModalController($uibModalInstance, authService) {
		var setCtrl = this;
		if (authService.getCachedProfile()) {
			_.set(setCtrl, 'auth', authService.getCachedProfile());
		} else {
			authService.getProfile(function(err, profile) {
				_.set(setCtrl, 'auth', profile);
			});
		}
		setCtrl.save = function () {
			console.log('save');
			$uibModalInstance.close('Save');
		};

		setCtrl.cancel = function () {
			console.log('cancel');
			$uibModalInstance.dismiss('Cancel');
		};
	}
	settingsModalController.$inject = ['$uibModalInstance','authService'];

	function adminModalController($uibModalInstance, authService, alertService, DDCSServers, DCSServerAPI) {
		var adminCtrl = this;
		_.set(adminCtrl, 'DDCSServers', DDCSServers);
		if (authService.getCachedProfile()) {
			_.set(adminCtrl, 'auth', authService.getCachedProfile());
		} else {
			authService.getProfile(function(err, profile) {
				_.set(adminCtrl, 'auth', profile);
			});
		}

		adminCtrl.save = function (server) {
			var curPayload = _.cloneDeep(server);
			_.set(curPayload, 'auth', _.cloneDeep(adminCtrl.auth));
			return DCSServerAPI.update(curPayload)
				.$promise
				.then(function (resp) {
					alertService.addAlert('success', 'Server Options Successfully Saved!');
					return resp;
				})
				.catch(function (err) {
					alertService.addAlert('danger', 'There was a problem saving server options.');
					return err;
				})
			;
		};

		adminCtrl.close = function () {
			$uibModalInstance.dismiss('Cancel');
		};
	}
	adminModalController.$inject = ['$uibModalInstance','authService', 'alertService', 'DDCSServers', 'dynamic-dcs.api.server'];

	angular
		.module('dynamic-dcs', [
			'dynamic-dcs.templates',
			'dynamic-dcs.dynMsgService',
			'dynamic-dcs.chat-box',
			'dynamic-dcs.api.server',
			'dynamic-dcs.alertService',
			'states',
			'ui.bootstrap',
			'dynamic-dcs.authService',
			'ngAnimate',
			'ngSanitize'
		])
		.config(['$qProvider', function ($qProvider) {
			$qProvider.errorOnUnhandledRejections(false);
		}])
		.controller('dynamicDCSController', dynamicDCSController)
		.controller('settingsModalController', settingsModalController)
		.controller('adminModalController', adminModalController)
	;

}(angular));
