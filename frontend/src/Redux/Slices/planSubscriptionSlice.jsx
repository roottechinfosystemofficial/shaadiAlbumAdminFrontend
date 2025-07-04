import { createSlice } from "@reduxjs/toolkit"
import { createSubscription,getPlanSubscriptionInfo, initiatePayment  } from "../thunkfunctions/plansubscription"

const initialState={
    subscriptionState:{
        plan : "",
        subScriptionLoading : false,
        subscriptionError : "",
        watermarkAccess:false,
        isConfirmPaymentSuccess:false,
        subscriptions : null,
        planExpired:false,
        orderId:"",
        paymentId:"",
        infoLoader:false,
        isActive:true


    }
}

const subscription=createSlice({
    name:"subscription",
    initialState,
    reducers:{
        setSubScriptionState(state,action){
            state.subscriptionState=action.payload
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(createSubscription.pending,(state)=>{
            state.subscriptionState.subScriptionLoading=true;
            state.subscriptionState.isConfirmPaymentSuccess=false;
            state.subscriptionState.subscriptionError=""
        })
         builder.addCase(createSubscription.fulfilled,(state)=>{
            state.subscriptionState.subScriptionLoading=false;
            state.subscriptionState.isConfirmPaymentSuccess=true;
            state.subscriptionState.subscriptionError=""
        })
        builder.addCase(createSubscription.rejected,(state,action)=>{
            state.subscriptionState.subScriptionLoading=false;
            state.subscriptionState.isConfirmPaymentSuccess=false;
            state.subscriptionState.subscriptionError=action.payload
        })
        builder.addCase(getPlanSubscriptionInfo.pending,(state,action)=>{
            state.subscriptionState.subScriptionLoading=false;
            state.subscriptionState.infoLoader=true;
            state.subscriptionState.isConfirmPaymentSuccess=false;
            state.subscriptionState.subscriptionError="";
            
        })
        builder.addCase(getPlanSubscriptionInfo.fulfilled,(state,action)=>{
            state.subscriptionState.subScriptionLoading=false;
            state.subscriptionState.infoLoader=false;
            state.subscriptionState.isConfirmPaymentSuccess=false;
            state.subscriptionState.subscriptionError="";
            state.subscriptionState.watermarkAccess=action.payload.watermarkAccess;
            state.subscriptionState.subscriptions=action.payload.subscriptions;
            console.log(action.payload)
            state.subscriptionState.planExpired=action.payload.planExpired
        })
        builder.addCase(initiatePayment.pending,(state)=>{
            state.subscriptionState.subScriptionLoading=true;
            state.subscriptionState.isConfirmPaymentSuccess=false;
            state.subscriptionState.subscriptionError=""
        })
         builder.addCase(initiatePayment.fulfilled,(state)=>{
            state.subscriptionState.subScriptionLoading=false;
            state.subscriptionState.subscriptionError=""
        })
        builder.addCase(initiatePayment.rejected,(state,action)=>{
            state.subscriptionState.subScriptionLoading=false;
            state.subscriptionState.isConfirmPaymentSuccess=false;
            state.subscriptionState.subscriptionError=action.payload
        })


    }

})

export default subscription.reducer;
export const{setSubScriptionState}=subscription.actions

