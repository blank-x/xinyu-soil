const progress = {
    state: {
        submitLoading: false
    },
    mutations: {
        SET_SUBMITLOADING: (state, status) => {
            state.submitLoading = status;
        }
    },

    actions: {
        setSubmitLoading({commit}, status){
            commit('SET_SUBMITLOADING', status)
        }
    }
}
export default progress
