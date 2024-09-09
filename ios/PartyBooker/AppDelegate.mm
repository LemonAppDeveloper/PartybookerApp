#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
//#import "SquareInAppPaymentsSDK"
#import <Firebase.h>

//#import <TwitterKit/TWTRKit.h>
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"PartyBooker";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  [[FBSDKApplicationDelegate sharedInstance] application:application
      didFinishLaunchingWithOptions:launchOptions];
  [FIRApp configure];
//  [SQIPInAppPaymentsSDK setSquareApplicationID:@"sandbox-sq0idb-NTOBxaCL7jJjvFNdIJ3P7Q"];
//  [SQIPInAppPaymentsSDK setSquareApplicationID:@"sq0idp-59-PEXuwBATCMDBkXI5cww"];
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
    openURL:url
    sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
    annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
  ];
  return handled;
  
//  BOOL handle2 =  [[Twitter sharedInstance] application:application openURL:url options:options];
//  // Add any custom logic here.
//  return handle2;
}
//- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options {
//  return [[Twitter sharedInstance] application:app openURL:url options:options];
//}
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
