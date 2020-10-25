package com.plugin.jPrlGSPKhr;





import android.graphics.Bitmap;
import android.provider.MediaStore;
import androidx.core.content.ContextCompat;
import org.opencv.android.Utils;
import org.opencv.core.Mat;
import org.opencv.imgproc.Imgproc;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;


public class OpenCvClass {



    public   static Bitmap BitmapToGray(Bitmap srcBitmap){

        Mat rgbMat = new Mat();
        Mat grayMat = new Mat();

        Bitmap grayBitmap = Bitmap.createBitmap(srcBitmap.getWidth(), srcBitmap.getHeight(), Bitmap.Config.RGB_565);
        Utils.bitmapToMat(srcBitmap, rgbMat);//convert original bitmap to Mat, R G B.
        Imgproc.cvtColor(rgbMat, grayMat, Imgproc.COLOR_RGB2GRAY);//rgbMat to gray grayMat
        Utils.matToBitmap(grayMat, grayBitmap); //convert mat to bitmap
//        img.setImageBitmap(grayBitmap);
        rgbMat.release(); //释放
        grayMat.release(); //释放
        srcBitmap.recycle(); //回收
        return  grayBitmap;

    }


    /** 保存方法 */
    public static void saveBitmap(Bitmap bitmap) {

        File f = new File("/storage/emulated/0/", "picName.jpg");
        if (f.exists()) {
            f.delete();
        }
        try {
            FileOutputStream out = new FileOutputStream(f);
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, out);
            out.flush();
            out.close();
        } catch (FileNotFoundException e) {
// TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
// TODO Auto-generated catch block
            e.printStackTrace();
        }
    }



}
