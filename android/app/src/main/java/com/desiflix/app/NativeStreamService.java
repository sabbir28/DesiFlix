package com.desiflix.app;

import android.app.DownloadManager;
import android.content.Context;
import android.net.Uri;
import android.os.Environment;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@CapacitorPlugin(name = "NativeStreamService")
public class NativeStreamService extends Plugin {

    private final ExecutorService executor = Executors.newFixedThreadPool(8);

    @PluginMethod
    public void probeStream(PluginCall call) {
        String urlString = call.getString("url");
        if (urlString == null) {
            call.reject("URL is required");
            return;
        }

        executor.execute(() -> {
            boolean working = false;
            int statusCode = -1;
            try {
                URL url = new URL(urlString);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("HEAD");
                conn.setConnectTimeout(2000);
                conn.setReadTimeout(2000);
                conn.setInstanceFollowRedirects(true);
                statusCode = conn.getResponseCode();
                if (statusCode >= 200 && statusCode < 400) {
                    working = true;
                }
                conn.disconnect();
            } catch (Exception e) {
                working = false;
            }

            JSObject ret = new JSObject();
            ret.put("working", working);
            ret.put("statusCode", statusCode);
            call.resolve(ret);
        });
    }

    @PluginMethod
    public void scanChannelsNative(PluginCall call) {
        String baseUrl = call.getString("baseUrl", "https://srv43.mlu49.top/Video/A");
        int startId = call.getInt("startId", 1);
        int count = call.getInt("count", 20);

        executor.execute(() -> {
            JSArray activeChannels = new JSArray();

            for (int i = 0; i < count; i++) {
                int testId = startId + i;
                String urlString = baseUrl + testId + ".mp4";
                try {
                    URL url = new URL(urlString);
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("HEAD");
                    conn.setConnectTimeout(1800);
                    conn.setReadTimeout(1800);
                    conn.setInstanceFollowRedirects(true);
                    int statusCode = conn.getResponseCode();
                    conn.disconnect();

                    if (statusCode >= 200 && statusCode < 400) {
                        JSObject ch = new JSObject();
                        ch.put("id", testId);
                        ch.put("url", urlString);
                        ch.put("name", "Channel A" + testId);
                        ch.put("statusCode", statusCode);
                        activeChannels.put(ch);
                    }
                } catch (Exception ignored) {}
            }

            JSObject ret = new JSObject();
            ret.put("foundCount", activeChannels.length());
            ret.put("channels", activeChannels);
            call.resolve(ret);
        });
    }

    @PluginMethod
    public void downloadStreamNative(PluginCall call) {
        String urlString = call.getString("url");
        String filename = call.getString("filename");

        if (urlString == null) {
            call.reject("URL is required");
            return;
        }

        if (filename == null || filename.isEmpty()) {
            filename = "DesiFlix_Stream.mp4";
        }

        try {
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(urlString));
            request.setTitle("DesiFlix Stream: " + filename);
            request.setDescription("Downloading high-speed video stream");
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, filename);

            DownloadManager manager = (DownloadManager) getContext().getSystemService(Context.DOWNLOAD_SERVICE);
            long downloadId = manager.enqueue(request);

            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("downloadId", downloadId);
            ret.put("message", "Started Native Download for " + filename);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Download failed: " + e.getMessage());
        }
    }
}
