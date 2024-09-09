
import {
    Alert
} from 'react-native';

class ErrorController {

    constructor() {
        this.EMPTY_FIRSTNAME = 'Please enter your first name';
        this.EMPTY_LASTNAME = 'Please enter your lastname';
        this.EMPTY_NICKNAME = 'Please enter your nickname';
        this.EMPTY_ADDRESS = 'Please enter your address';
        this.EMPTY_PHONE = 'Please enter your phone number';
        this.COUNTRYCODE_ERROR = 'Please enter country code of your phone number';
        this.EMPTY_COUNTRY = 'Please enter country';
        this.EMPTY_COUNTRYCODE = 'Please enter country code';
        this.EMPTY_CITY = 'Please enter city name';
        this.EMPTY_ZIPCODE = 'Please enter zip code';
        this.EMPTY_STATE = 'Please enter state';
        this.INVALID_PHONE = 'Please enter valid phone number';
        this.EMPTY_EMAIL = 'Please enter your email';
        this.INVALID_EMAIL = 'Please enter valid email address';
        this.EMPTY_PASSWORD = 'Please enter password';
        this.EMPTY_CONFIRM_PASSWORD = 'Please confirm password';
        this.INVALID_PASSWORD = 'Password should be minimum 6 characters';
        this.PASSWORD_NOT_MATCHING = 'Passwords are not matching';
        this.EMPTY_OTP = 'Please enter otp';
        this.NEW_PASSWORD_ERROR = 'Please enter valid password';
        this.EMPTY_GENDER_ERROR = 'Please select user type';
        this.EMPTY_CATEGORY_ERROR = 'Please select a category';
        this.EMPTY_SUB_CATEGORY_ERROR = 'Please select a sub category';
        this.EMPTY_SUB_SUB_CATEGORY_ERROR = 'Please select a sub sub category';
        this.EMPTY_BRAND_ERROR = 'Please select a brand';
        this.EMPTY_PRODUCT_NAME_ERROR = 'Please enter product name';
        this.EMPTY_PRODUCT_ORIGINAL_PRICE_ERROR = "Please enter product's original price";
        this.EMPTY_PRODUCT_SELLING_PRICE_ERROR = "Please enter product's selling price";
        this.EMPTY_PRODUCT_SIZE = "Please select product's size";
        this.EMPTY_PRODUCT_COLOR = "Please select product's color";
        this.EMPTY_PRODUCT_DESCRIPTION = "Please enter product's description";
        this.EMPTY_SHIPPING_COST = "Please enter shipping cost";
        this.EMPTY_PRICE_FOR_THREE_DAYS = "Please enter price for 3 days rent";
        this.EMPTY_PRICE_FOR_PER_WEEK = "Please enter price for per week rent";
        this.EMPTY_PRICE_FOR_PER_MONTH = "Please enter price for per month rent";
        this.EMPTY_PRICE_FOR_RENTAL_DEPOSIT = "Please enter rental deposit price";
        this.EMPTY_IMAGE_WARNING = "Please select images of the product";
        this.EMPTY_CONDITION = "Please select the condition of item";
        this.PROFILE_STATUS_VALIDATION = "Your profile description must be greater than 30 characters";
        this.EMPTY_ACCOUNT_NUMBER = "Enter your bank account number";
        this.EMPTY_ROUTING_NUMBER = "Enter your bank routing number";
        this.EMPTY_ACCOUNT_HOLDER_NAME = "Enter your name";
        this.EMPTY_ACCOUNT_TYPE = "Select account type";
        this.EMPTY_ADDRESS_1 = 'Please enter address line 1';
        this.EMPTY_ADDRESS_2 = 'Please enter address line 2';
        this.EMPTY_DOB = 'Please enter date of birth';
        this.EMPTY_TRANSIT_NUMBER = 'Please enter transit number';
        this.EMPTY_INSTITUTION_NUMBER = 'Please enter institution number';
    }

    showError({ title = "Error", msg, cb = () => { } }) {
        setTimeout(function () {
            Alert.alert(
                title,
                msg,
                [
                    { text: 'OK', onPress: () => cb() }
                ],
                { cancelable: false }
            );
        }, 500);
    }

}

export const ErrorCtrl = new ErrorController();