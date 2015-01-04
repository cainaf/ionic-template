android update project --subprojects --path "platforms/android" --target android-19 --library "CordovaLib"
 
android update project --subprojects --path "platforms/android" --target android-19 --library "com.phonegap.plugins.facebookconnect/FacebookLib"
 
cd platforms/android/
 
ant clean
 
cd com.phonegap.plugins.facebookconnect/FacebookLib
 
ant clean
 
ant release
 
cd ../../..