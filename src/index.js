/**
 * Plugin allows to delete a customer account from Magento.
 * Delete must be confirmed with token fetched from email message
 * @param config
 * @param db
 * @param router
 * @param cache
 * @param apiStatus
 * @param apiError
 * @param getRestApiClient
 * @returns {{router: *, route: string, pluginName: string, domainName: string}}
 */
module.exports = ({ config, db, router, cache, apiStatus, apiError, getRestApiClient }) => {
    const createMage2RestClient = () => {
        const client = getRestApiClient();
        client.addMethods('deleteCustomer', (restClient) => {
            const module = {};
            module.notify = (customerId, token) => {
                return restClient.post(`/kmk-customer/delete-account/notify/${customerId}`, token);
            };
            module.confirm = (customerId, token) => {
              return restClient.post('/kmk-customer/delete-account/confirm', { confirmation: { customer_id: customerId, token } }, token);
            };

            return module;
        });

        return client;
    };

    router.post('/:customerId', async (req, res) => {
        const {customerId} = req.params;
        const {token} = req.query;
        try {
            if (!token) { throw new Error('Customer token is invalid'); }
            if (!customerId) { throw new Error(`Customer id is required`); }

            const client = createMage2RestClient();
            client.deleteCustomer.notify(customerId, token)
                .then(response => apiStatus(res, response))
                .catch(err => apiError(res, err))
        } catch (e) {
            apiError(res, e);
        }
    });

    router.post('/confirm/:customerId', async (req, res) => {
        const {customerId} = req.params;
        const {token} = req.query;
        try {
            if (!token) { throw new Error('Delete token is invalid'); }
            if (!customerId) { throw new Error(`Customer id is required`); }

            const client = createMage2RestClient();
            client.deleteCustomer.confirm(customerId, token)
                .then(response => apiStatus(res, response))
                .catch(err => apiError(res, err))
        } catch (e) {
            apiError(res, e);
        }
    });

    return {
        domainName: '@grupakmk',
        pluginName: 'customer-delete',
        route: '/customer-delete',
        router
    };
};
