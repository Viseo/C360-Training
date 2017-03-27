

describe('test', function () {

    let vm;

    beforeEach(function () {
        //vm = new Vue(NavigationMenu).$mount()
    vmNavigationMenu = new NavigationMenu().$mount();
    vmFormulaire = new Formulaire().$mount();
    });

    afterEach(function () {

    });

    it('hould check variable initialization from navigation-menu component', function () {
        expect(vmNavigationMenu.color_connexion).toBe('color-blue');
        expect(vmNavigationMenu.color_inscription).toBe('color-blue');
        expect(vmNavigationMenu.tabconnexion).toBe('tab');
        expect(vmNavigationMenu.tabinscription).toBe('tab active');
        expect(vmNavigationMenu.$el.textContent).toBe('Inscription Connexion');

        //console.log('text:'+vm.$el.textContent);
    });

    it('should check variable initialization', function () {
            vmFormulaire.verifyEmail('Abc.@example.com');
        expect(vmFormulaire.isEmailValid).toBe(false);

/*
        expect(vmFormulaire.verifyEmail('Abc.@example.com')).toBe(false);
*/
    });

});
