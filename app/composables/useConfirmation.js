import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useHttp } from '~/composables/useHttp.js';

/**
 * Generic confirmation dialog composable
 * Handles various types of confirmations with API calls
 */
export function useConfirmation() {
    const confirm = useConfirm();
    const toast = useToast();
    const { httpDelete, httpPost, httpPut } = useHttp();

    /**
     * Show a generic confirmation dialog
     * @param {Object} config - Configuration object
     * @param {string} config.message - Confirmation message
     * @param {string} config.header - Dialog header
     * @param {Function} config.onAccept - Function to execute on accept
     * @param {Function} config.onReject - Function to execute on reject (optional)
     * @param {Object} config.acceptProps - Custom accept button props
     * @param {Object} config.rejectProps - Custom reject button props
     */
    const showConfirmation = (config) => {
        const {
            message = 'Are you sure you want to proceed?',
            header = 'Confirmation',
            onAccept = () => {},
            onReject = () => {},
            acceptProps = { label: 'Yes' },
            rejectProps = { label: 'Cancel', severity: 'secondary', outlined: true }
        } = config;

        confirm.require({
            message,
            header,
            icon: 'pi pi-info-circle',
            rejectProps,
            acceptProps,
            accept: onAccept,
            reject: onReject
        });
    };

    /**
     * Show delete confirmation and perform deletion
     * @param {Object} config - Configuration object
     * @param {string} config.endpoint - API endpoint for deletion
     * @param {string} config.resourceName - Name of resource being deleted
     * @param {Function} config.onSuccess - Callback after successful deletion
     * @param {string} config.message - Custom confirmation message
     * @param {string} config.header - Custom dialog header
     */
    const confirmDelete = async (config) => {
        const {
            endpoint,
            resourceName = 'record',
            onSuccess = () => {},
            message = `Do you want to delete this ${resourceName}?`,
            header = 'Delete Confirmation'
        } = config;

        confirm.require({
            message,
            header,
            icon: 'pi pi-exclamation-triangle',
            rejectProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptProps: {
                label: 'Delete',
                severity: 'danger'
            },
            accept: async () => {
                try {
                    const { success, message: responseMessage } = await httpDelete(endpoint);
                    if (success) {
                        toast.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: responseMessage || `${resourceName} deleted successfully`,
                            life: 3000
                        });
                        onSuccess();
                    }
                } catch (error) {
                    console.log('Delete error:', error.data);
                    toast.add({
                        severity: 'error',
                        summary: 'Error!',
                        detail: error.data?.message || `Failed to delete ${resourceName}`,
                        life: 3000
                    });
                }
            }
        });
    };

    /**
     * Show confirmation and perform a POST request
     * @param {Object} config - Configuration object
     * @param {string} config.endpoint - API endpoint
     * @param {Object} config.data - Data to send
     * @param {Function} config.onSuccess - Callback after success
     * @param {string} config.message - Confirmation message
     * @param {string} config.header - Dialog header
     * @param {string} config.successMessage - Success toast message
     */
    const confirmAction = async (config) => {
        const {
            endpoint,
            data = {},
            onSuccess = () => {},
            message = 'Are you sure you want to perform this action?',
            header = 'Confirmation',
            successMessage = 'Action completed successfully',
            method = 'POST' // 'POST', 'PUT', 'PATCH'
        } = config;

        confirm.require({
            message,
            header,
            icon: 'pi pi-info-circle',
            rejectProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptProps: {
                label: 'Confirm',
                severity: 'primary'
            },
            accept: async () => {
                try {
                    let response;
                    if (method === 'PUT') {
                        response = await httpPut(endpoint, data);
                    } else {
                        response = await httpPost(endpoint, data);
                    }
                    
                    const { success, message: responseMessage } = response;
                    if (success) {
                        toast.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: responseMessage || successMessage,
                            life: 3000
                        });
                        onSuccess();
                    }
                } catch (error) {
                    console.log('Action error:', error.data);
                    toast.add({
                        severity: 'error',
                        summary: 'Error!',
                        detail: error.data?.message || 'Failed to perform action',
                        life: 3000
                    });
                }
            }
        });
    };

    return {
        showConfirmation,
        confirmDelete,
        confirmAction
    };
}
