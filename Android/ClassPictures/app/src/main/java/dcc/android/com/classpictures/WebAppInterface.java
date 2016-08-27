package dcc.android.com.classpictures;

import android.content.Context;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

/**
 * Created by Fabio on 25/08/2016.
 */
public class WebAppInterface {
    Context mContext;

    WebAppInterface(Context c){
        mContext = c;
    }

    @JavascriptInterface
    public void showToast(String toastText){
        Toast.makeText(mContext, toastText, Toast.LENGTH_SHORT).show();
    }

}
