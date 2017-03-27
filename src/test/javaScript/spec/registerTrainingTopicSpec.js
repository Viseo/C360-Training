

describe('test', function () {

    let vm;

    beforeEach(function () {
        //vm = new Vue(NavigationMenu).$mount()
    vm = new NavigationMenu().$mount();
    });

    afterEach(function () {

    });

    it('Test Variable', function () {
        expect(vm.color_connexion).toBe('color-blue');
        expect(vm.color_inscription).toBe('color-blue');
        expect(vm.tabconnexion).toBe('tab');
        expect(vm.tabinscription).toBe('tab active');

        //console.log('text:'+vm.$el.textContent);
    });


});
