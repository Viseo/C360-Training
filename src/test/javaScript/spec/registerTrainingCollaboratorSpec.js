/**
 * Created by CLH3623 on 18/04/2017.
 */
beforeEach(function () {
    vmCollaboratorFormation = new CollaboratorFormation().$mount();
});

describe('test registerTrainingCollaborator', function() {

    it('should transform text to uppercase', function() {
        vmCollaboratorFormation.value = 'programmation';
        expect(vmCollaboratorFormation.searchFormatted).toBe('PROGRAMMATION');
        vmCollaboratorFormation.value = '';
        expect(vmCollaboratorFormation.searchFormatted).toBe('');
    });

    it('should display a formation if it exists', function() {
        vmCollaboratorFormation.selectedTraining = null;
        expect(vmCollaboratorFormation.emptyTraining).toBe(false);
        vmCollaboratorFormation.$refs.btnValidateSearch.click();
        expect(vmCollaboratorFormation.emptyTraining).toBe(true);
        vmCollaboratorFormation.selectedTraining = 5;
        vmCollaboratorFormation.$refs.btnValidateSearch.click();

    })
});