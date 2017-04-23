package com.tolpa;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.beefe.picker.PickerViewPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.*;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new PickerViewPackage(),
            new ImagePickerPackage(),
            new VectorIconsPackage(),
            new MapsPackage(),
            new FBSDKPackage(mCallbackManager),
            new LinearGradientPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    FacebookSdk.setApplicationId(getString(R.string.facebook_app_id));
    FacebookSdk.sdkInitialize(getApplicationContext());
    SoLoader.init(this, /* native exopackage */ false);
  }
}
