package net.lemonsoft.lwc.core.viewController;

import javafx.application.Platform;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.concurrent.Worker.*;
import javafx.event.EventHandler;
import javafx.scene.Scene;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import net.lemonsoft.lwc.core.BrowserCommand;
import net.lemonsoft.lwc.core.SubController;

import java.util.UUID;

/**
 * 浏览器对象
 * Created by lemonsoft on 2016/8/14.
 */
public class BrowserViewController extends Stage {

    /**
     * WebView控件
     */
    private WebView browserView;
    private WebEngine browser;
    private Scene rootScene;
    private String id;
    private SubController belongSubController;// 归属于的子控制器

    private BrowserConsoleCommand browserConsoleCommand;

    private LoadURLHandler loadURLHandler;

    private BrowserViewController() {
        super();
    }

    public BrowserViewController(SubController belongSubController) {
        super();
        setTitle("New Blank BrowserViewController");
        this.setWidth(640);
        this.setHeight(520);
        this.belongSubController = belongSubController;
        this.id = UUID.randomUUID().toString();
        this.browserView = new WebView();
        this.browser = this.browserView.getEngine();
//        this.browser.setPopupHandler(new PopupHandler() {
//            @Override
//            public PopupContainer handlePopup(PopupParams popupParams) {
//                browser.loadURL(popupParams.getURL());
//                return null;
//            }
//        });
        this.rootScene = new Scene(browserView);
        this.setScene(rootScene);
        browserConsoleCommand = new BrowserConsoleCommand();
        this.browser.getLoadWorker().stateProperty().addListener(new ChangeListener<State>() {
            @Override
            public void changed(ObservableValue<? extends State> observable, State oldValue, State newValue) {
                if (newValue == State.SUCCEEDED) {
                    //添加節點，或者把app注入到網頁腳本當中
                }
            }
        });
        this.browser.addLoadListener(new LoadAdapter() {

            @Override
            public void onDocumentLoadedInFrame(FrameLoadEvent frameLoadEvent) {
                super.onDocumentLoadedInFrame(frameLoadEvent);
                if (loadURLHandler != null)
                    loadURLHandler.loadSuccess();
                loadCompleteDeal();
            }

            @Override
            public void onFailLoadingFrame(FailLoadingEvent failLoadingEvent) {
                super.onFailLoadingFrame(failLoadingEvent);
                if (loadURLHandler != null)
                    loadURLHandler.loadFailed();
                loadCompleteDeal();
            }
        });
        this.showingProperty().addListener(new ChangeListener<Boolean>() {
            @Override
            public void changed(ObservableValue<? extends Boolean> observable, Boolean oldValue, Boolean newValue) {
                belongSubController.refreshGUI();
            }
        });
        final boolean[] shift_press = {false};
        final boolean[] s_press = {false};
        final boolean[] m_press = {false};
        final boolean[] d_press = {false};
        final boolean[] c_press = {false};
        // 监听键盘的快捷键组合
        // shift+s shift+m shift+m shift+d shift+c
        this.addEventHandler(KeyEvent.KEY_PRESSED, new EventHandler<KeyEvent>() {
            @Override
            public void handle(KeyEvent event) {
                KeyCode code = event.getCode();
                switch (code) {
                    case SHIFT:
                        shift_press[0] = true;
                        break;
                    case S:
                        s_press[0] = true;
                        break;
                    case M:
                        m_press[0] = true;
                        break;
                    case D:
                        d_press[0] = true;
                        break;
                    case C:
                        c_press[0] = true;
                        break;
                    default:
                }
                if (shift_press[0] && s_press[0])
                    belongSubController.getGUIStage().show();// 触发shift-s执行代码
                if (shift_press[0] && m_press[0])
                    belongSubController.getBelongMainManager().getGUIStage().show();// 触发shift-d执行代码
                if (shift_press[0] && d_press[0])
                    belongSubController.showDataCollectionGUI();
                if (shift_press[0] && c_press[0])
                    belongSubController.getConsole().show();
            }
        });
        this.addEventHandler(KeyEvent.KEY_RELEASED, new EventHandler<KeyEvent>() {
            @Override
            public void handle(KeyEvent event) {
                KeyCode code = event.getCode();
                switch (code) {
                    case SHIFT:
                        shift_press[0] = false;
                        break;
                    case S:
                        s_press[0] = false;
                        break;
                    case M:
                        m_press[0] = false;
                        break;
                    case D:
                        d_press[0] = false;
                        break;
                    case C:
                        c_press[0] = false;
                        break;
                    default:
                }
            }
        });
    }

    public void loadCompleteDeal() {
        try {
            loadURLHandler = null;
            belongSubController.refreshGUI();
            Platform.runLater(new Runnable() {
                @Override
                public void run() {
                    setTitle(String.format("[%s] - %s", id, (String) browser.getTitle()));
                }
            });

            JSValue window = browser.executeJavaScriptAndReturnValue("window");
            window.asObject().setProperty("console", browserConsoleCommand);// 设置控制台命令
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取当前浏览器的标识符id
     *
     * @return 当前浏览器的标识符id
     */
    public String getId() {
        return this.id;
    }

    /**
     * 获取浏览器加载的URL
     *
     * @return 当前浏览器加载的url
     */
    public String getCurrentUrl() {
        String result = executeJavaScript("location.href").getStringValue();
        return result;
    }

    /**
     * 获取当前浏览器的标题
     *
     * @return 当前浏览器应显示的标题
     */
    public String getCurrentTitle() {
        String result = executeJavaScript("document.title").getStringValue();
        return result;
    }

    /**
     * 在浏览器中执行js代码
     *
     * @param jsCode 要在浏览器中执行的js代码
     * @return 代码执行的返回值
     */
    public JSValue executeJavaScript(String jsCode) {
        String jsCommand = String.format("JSON.stringify(eval(\"%s\"))", jsCode);
        JSValue result = browser.executeJavaScriptAndReturnValue(jsCommand);
        // 临时判断采集的返回值类型，确保不出现位置的ak对象
        if (result != null && !result.getClass().getName().contains("chromium.ak")) {
            try {
                browserConsoleCommand.result(result.getStringValue());
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            System.out.println(" OMHG!!!");
        }
        return result;
    }

    /**
     * 加载URL
     *
     * @param url            要加载的指定的url
     * @param loadURLHandler 加载的回调机制
     */
    public void loadUrl(String url, LoadURLHandler loadURLHandler) {
        this.loadURLHandler = loadURLHandler;
        this.browser.loadURL(url);
    }

    /**
     * 设置当前浏览器窗口是否显示
     *
     * @param isShow 设置浏览器窗口是否显示的布尔值
     */
    public void setShowOrHide(boolean isShow) {
        if (isShow)
            this.show();
        else
            this.hide();
    }

    /**
     * 在浏览器中执行命令对象
     *
     * @param command 要执行的浏览器命令对象
     * @return 命令执行的返回值
     */
    public Object executeBrowserCommand(BrowserCommand command) {
        return executeJavaScript(command.getJavaScriptCode());
    }

    public class BrowserConsoleCommand {
        public void log(String info) {
            String out = String.format("[BrowserViewController Log] %s", info);
            System.out.println(out);
            if (belongSubController.viewController != null) {
                belongSubController.consoleOut(getId(), out);
            }
        }

        public void result(String info) {
            String out = String.format("[BrowserViewController executeResult] %s", info);
            System.out.println(out);
            if (belongSubController.viewController != null) {
                belongSubController.consoleOut(getId(), out);
            }
        }

        public void error(String info) {
            String out = String.format("[BrowserViewController Err] %s", info);
            System.err.println(out);
            if (belongSubController.viewController != null) {
                belongSubController.consoleOut(getId(), out);
            }
        }
    }

    /**
     * 加载URL的机制
     */
    public interface LoadURLHandler {

        /**
         * 加载成功
         */
        void loadSuccess();

        /**
         * 加载失败
         */
        void loadFailed();
    }

}
