// REST API BASE URL
export const APP_URL = "https://partybookr.projectdemo.click/";

const Apis = {

    ABOUT_US: 'https://partybookr.projectdemo.click/about',
    CONTACT_US: 'https://partybookr.projectdemo.click/contact',
    PRIVACY_POLICY: 'https://partybookr.projectdemo.click/privacy-policy',
    TERMS_CONDITION: 'https://partybookr.projectdemo.click/terms-of-use',
    FAQ: 'https://partybookr.projectdemo.click/faq',
    INTERNET_SECURITY: 'https://partybookr.projectdemo.click/internet-security',

    LOGIN: APP_URL + "api/login",
    REGISTER: APP_URL + "api/signup",
    UPDATE_PROFILE: APP_URL + "api/update-profile",
    FORGOT_PASSWORD: APP_URL + "api/forgot-password",
    CHANGE_PASSWORD: APP_URL + "api/change-password",
    GET_PROFILE: APP_URL + "api/get-profile",
    SOCIAL_LOGIN: APP_URL + "api/socialLogin", //1

    CREATE_EVENT: APP_URL + "api/event/create",
    GET_EVENT: APP_URL + "api/event/get",
    DETAILS_OF_EVENT: APP_URL + "api/event/detail",
    DELETE_EVENT: APP_URL + "api/event/delete",

    FAQ: APP_URL + "api/faq",
    CMS_PAGE: APP_URL + "api/cms",
    GENERAL_DETAIL: APP_URL + "api/general",

    GET_CATEGORY: APP_URL + "api/category",
    GET_SUB_CATEGORY: APP_URL + "api/get-sub-category",

    VENDOR_PLAN_GET: APP_URL + "api/vendor/plan/get",
    VENDOR_PLAN_DELETE: APP_URL + "api/vendor/plan/delete",
    VENDOR_PLAN_ADD_UPDATE: APP_URL + "api/vendor/plan/add-update",
    VENDOR_FAVLIST_ADD_UPDATE: APP_URL + "api/update-favorite",

    VENDOR_PROFIL_DESCRIPTION: APP_URL + "api/vendor/profile/update-description",
    VENDOR_CUSTOMER_REVIEW: APP_URL + "api/vendor/customer-reviews/get",
    VENDOR_CUSTOMER_ADD_REVIEW: APP_URL + "api/vendor/customer-reviews/add",

    VENDOR_GET_PROFILESS: APP_URL + "api/vendor/get",
    VENDOR_DETAIL: APP_URL + "api/vendor/detail",

    VENDOR_CART_GET: APP_URL + "api/cart/get",
    VENDOR_CART_REMOVE: APP_URL + "api/cart/remove",
    VENDOR_CART_ADD: APP_URL + "api/cart/add",
    VENDOR_CART_CANCEL_BOOKING: APP_URL + "api/cart/cancel-booking",

    CONFIRM_BOOKING: APP_URL + "api/cart/confirm-booking",
    SQUARE_PAYMENT: APP_URL + "api/cart/payment-token",
    CANCEL_BOOKING: APP_URL + "api/cart/cancel-booking",

    PRODUCT_GET: " ",
    PRODUCT_DELETE: " ",
    PRODUCT_ADD_UPDATE: " ",

    PLANEED_PARTIES: APP_URL + "api/party/planned",
    PREVIOUS_PARTIES: APP_URL + "api/party/previous",

    MY_FAVORITE_ALL: APP_URL + "api/my-favorite",
    DELETE_FAVORITE_ALL: APP_URL + "api/remove-favorite",
    ADD_TO_FAVORITE_ALL: APP_URL + "api/favorite-to-cart",
    NOTFICATION_UPDATE: APP_URL + "api/notification-update",
    UPDATE_NOTFICATION_UPDATE: APP_URL + "api/update-notification-token",
    NOTFICATION_GET: APP_URL + "api/notification-get",
    NOTFICATION_DETAIL: APP_URL + "api/notification-detail",
}

export default Apis;