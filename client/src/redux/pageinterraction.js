import { createSlice } from "@reduxjs/toolkit";

const pageInteractions = createSlice({
    name: 'pageInsteractionSlice',
    initialState: {
        //--------- adminPage states --------------------//
        sideNav: true,
        createPen: true,
        updatePen:true,
        responseCheck: true,
        updateAdminList: {},
        adminPenListSearch: [],
        adminPenListArray: [],


        //------------- partnerPage states ------------------//
        updatePartnerList: {},
        partnerPenListSearch: [],
        partnerPenListArray: [],
        
        //------------- uniquePage states ------------------//
        uniquePenPageArrayList: [], 
        uniqueItemListing:[],
        uniquePageListUpdate:false,
        uniquePageListUpdateItem:{},
        uniquePageListUpdateItemNewRecord:{},

        //--------------------------------------------------//
        uniqueAnanlysis:[],

        //----------------------footer analysis-------------------------//
        footerAnalysis:{}

    },
    reducers: {
        //-------------- adminPage reducers----------------//
        actOnSideNav: function (state, action) {
            state.sideNav = action.payload
        },
        actOnCreatePen: function (state, action) {
            state.createPen = action.payload
        },
        actOnUpdatePen: function (state, action) {
            state.updatePen = action.payload
        },
        actOnResponseCheck: function (state, action) {
            state.responseCheck = action.payload
        },
        actOnUpdateAdminList: function (state, action) {
            state.updateAdminList = action.payload
        },
        actOnAdminPenListSearch: function (state, action) {
            state.adminPenListSearch = action.payload
        },
        actOnAdminPenListArray: function (state, action) {
            state.adminPenListArray = action.payload
        },
        //--------------- adminPage reducders-----------------

        actOnUpdatePartnerList: function (state, action) {
            state.updatePartnerList = action.payload
        },
        actOnPartnerPenListSearch: function (state, action) {
            state.partnerPenListSearch = action.payload
        },
        actOnPartnerPenListArray: function (state, action) {
            state.partnerPenListArray = action.payload
        },
        //--------------- uniquePage reducders-----------------
        actOnuniquePenPageArrayList: function (state, action) {
            state.uniquePenPageArrayList = action.payload
        },
        actOnuniqueItemListing: function (state, action) {
            state.uniqueItemListing = action.payload
        },
        actOnuniquePageListUpdate: function (state, action) {
            state.uniquePageListUpdate = action.payload
        },
        actOnuniquePageListUpdateItemNewRecord: function (state, action) {
            state.uniquePageListUpdateItemNewRecord = action.payload
        },
        actOnuniquePageListItemUpdate: function (state, action) {
            const recievedUniqueList = action.payload
            const updateList = {...state.uniquePageListUpdateItem, ...recievedUniqueList}
            state.uniquePageListUpdateItem = updateList
        },
        actOnUniqueAnalysis:function(state, action){
            state.uniqueAnanlysis= action.payload
        },
        actOnFooterAnalysis:function(state, action){
            const dataReceived = action.payload
            state.footerAnalysis = dataReceived
        }

    }

})
export const {
    actOnSideNav, actOnCreatePen,actOnUpdatePen,
    actOnAdminPenListSearch, actOnAdminPenListArray,
    actOnUpdateAdminList, actOnResponseCheck,
    actOnUpdatePartnerList,actOnPartnerPenListSearch,
    actOnPartnerPenListArray,actOnuniquePenPageArrayList,
    actOnuniqueItemListing,actOnuniquePageListUpdate,
    actOnuniquePageListItemUpdate,actOnuniquePageListUpdateItemNewRecord,
    actOnUniqueAnalysis,actOnFooterAnalysis
} = pageInteractions.actions

export default pageInteractions.reducer