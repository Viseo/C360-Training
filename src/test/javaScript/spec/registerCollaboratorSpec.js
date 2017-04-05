describe('test registerCollaborator.js', function () {

    let vm;

    beforeEach(function () {
        //vm = new Vue(NavigationMenu).$mount()
        vmNavigationMenu = new NavigationMenu().$mount();
        vmFormulaire = new Formulaire().$mount();
    });

    afterEach(function () {

    });

    it('should check variable initialization from navigation-menu component', function () {
        expect(vmNavigationMenu.color_connexion).toBe('color-blue');
        expect(vmNavigationMenu.color_inscription).toBe('color-blue');
        expect(vmNavigationMenu.tabconnexion).toBe('tab active');
        expect(vmNavigationMenu.tabinscription).toBe('tab');
        //expect(vmNavigationMenu.$el.textContent).toBe('Inscription Connexion');

        //console.log('text:'+vm.$el.textContent);
    });

    it('Test personnalIdNumber', function () {
        vmFormulaire.verifyLogin('AZE1234');
        expect(vmFormulaire.isLoginValid).toBe(true);
        expect(vmFormulaire.errorMessageLogin).toBe('');
        vmFormulaire.verifyLogin('aZE1234');
        expect(vmFormulaire.isLoginValid).toBe(false);
        expect(vmFormulaire.errorMessageLogin).toBe('Veuillez entrer  code de login valide');
        vmFormulaire. personnalIdNumber = '';
        vmFormulaire.isLoginEmpty();
        expect(vmFormulaire.loginEmpty).toBe(true);
    });

    it('Test lastName', function () {
        vmFormulaire.verifyLastName('eric');
        expect(vmFormulaire.isLastNameValid).toBe(true);
        expect(vmFormulaire.errorMessageLastName).toBe('');
        vmFormulaire.verifyLastName('7474efef');
        expect(vmFormulaire.isLastNameValid).toBe(false);
        expect(vmFormulaire.errorMessageLastName).toBe('Veuillez entrer un nom valide');
        vmFormulaire.lastName = '';
        vmFormulaire.isLastNameEmpty()
        expect(vmFormulaire.lastNameEmpty).toBe(true);
    });

    it('Test firstName', function () {
        vmFormulaire.verifyFirstName('caroline');
        expect(vmFormulaire.isFirstNameValid).toBe(true);
        expect(vmFormulaire.errorMessageFirstName).toBe('');
        vmFormulaire.verifyFirstName('8547caroline');
        expect(vmFormulaire.isFirstNameValid).toBe(false);
        expect(vmFormulaire.errorMessageFirstName).toBe('Veuillez entrer un Prénom valide');
        vmFormulaire.firstName = '';
        vmFormulaire.isFirstNameEmpty();
        expect(vmFormulaire.firstNameEmpty).toBe(true);
    });

    it('Test email', function () {
        vmFormulaire.verifyEmail('ouahib@gmail.com');
        expect(vmFormulaire.isEmailValid).toBe(true);
        expect(vmFormulaire.errorMessageEmail).toBe('');
        vmFormulaire.verifyEmail('Abc.@example.com');
        expect(vmFormulaire.isEmailValid).toBe(false);
        expect(vmFormulaire.errorMessageEmail).toBe('Veuillez entrer un email valide');
        vmFormulaire.email = '';
        vmFormulaire.isEmailEmpty();
        expect(vmFormulaire.emailEmpty).toBe(true);
    });

    it('Test password',function () {
        vmFormulaire.verifyPassword('123456');
        expect(vmFormulaire.isPasswordValid).toBe(true);
        expect(vmFormulaire.errorMessagePassword).toBe('');
        vmFormulaire.verifyPassword('12345');
        expect(vmFormulaire.isPasswordValid).toBe(false);
        expect(vmFormulaire.errorMessagePassword).toBe('Le mot de passe doit avoir au minimum 6 caractères');
        vmFormulaire.password = '';
        vmFormulaire.isPasswordEmpty();
        expect(vmFormulaire.passwordEmpty).toBe(true);

    });

    it('Test confirmPassword',function () {
        vmFormulaire.password = '123456';
        vmFormulaire.confirmPassword = '123456';
        vmFormulaire.verifyConfirmPassword();
        expect(vmFormulaire.isConfirmPasswordValid).toBe(true);
        expect(vmFormulaire.errorMessageConfirmPassword).toBe('');
        vmFormulaire.password = '123456';
        vmFormulaire.confirmPassword = '12345';
        vmFormulaire.verifyConfirmPassword();
        expect(vmFormulaire.isConfirmPasswordValid).toBe(false);
        expect(vmFormulaire.errorMessageConfirmPassword).toBe('La confirmation du mot de passe n\'est pas valide');
        vmFormulaire.confirmPassword = '';
        vmFormulaire. isConfirmPasswordEmpty();
        expect(vmFormulaire.confirmPasswordEmpty).toBe(true);
    });

    /*it('Test verifyForm',function () {
       vmFormulaire.personnalIdNumber = 'AZE1234';
       vmFormulaire.lastName = 'dupon';
       vmFormulaire.firstName = 'erica';
       vmFormulaire.email = 'dupon@gmail.com';
       vmFormulaire.password = '123456';
       vmFormulaire.confirmPassword = '123456';
       vmFormulaire.verifyForm ();
       console.log(vmFormulaire.collaborator.email);
    });*/

});
