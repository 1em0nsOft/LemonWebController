package net.lemonsoft.lwc.core.viewController;

import javafx.event.Event;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Alert;
import javafx.scene.control.Tab;
import javafx.scene.control.TabPane;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
import net.lemonsoft.lwc.core.SubController;
import net.lemonsoft.lwc.core.Tty;

import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.ResourceBundle;

/**
 * 子控制器的控制台
 * Created by LiuRi on 16/8/17.
 */
public class SubControllerConsoleViewController implements Initializable {

    public SubController belongSubController;
    private Stage consoleStage;
    private HashMap<String, Tty> ttyPool;// 控制台单位池
    private List<String> ttyList;// 控制台单位列表，用于记录TTY ID与GUI界面的顺序对应

    private Tty defaultTty;

    @FXML
    private TabPane consoleTabPane;
    @FXML
    private TextField newTtyNameTextField;// 新Tty名称输入框

    public TabPane getConsoleTabPane(){
        return consoleTabPane;
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        ttyPool = new HashMap<>();
        ttyList = new ArrayList<>();
        // create a default tty
    }

    public Stage getConsoleStage() {
        return consoleStage;
    }

    public void setConsoleStage(Stage consoleStage) {
        this.consoleStage = consoleStage;
    }

    /**
     * 显示控制台GUI界面
     */
    public void show() {
        consoleStage.show();
    }

    /**
     * 隐藏控制台GUI界面
     */
    public void hide() {
        consoleStage.hide();
    }

    /**
     * 通过GUI创建一个TTY
     */
    public void createTtyWithGUI() {
        if (newTtyNameTextField.getText().length() > 0) {
            this.createATty(newTtyNameTextField.getText());
        } else {
            Alert alert = new Alert(Alert.AlertType.ERROR, "");
            alert.setTitle("Create new tty error");
            alert.getDialogPane().setContentText("Can not create new tty, because you have not entered the name of the TTY!");
            alert.showAndWait();
        }
    }

    /**
     * 添加一个TTY
     */
    public Tty createATty(String ttyName) {
        Tty tty = new Tty(ttyName , belongSubController);
        Tab tab = new Tab(ttyName);
        tab.setContent(tty.getContainer());
        consoleTabPane.getTabs().add(tab);
        ttyPool.put(tty.getId(), tty);
        ttyList.add(tty.getId());
        tab.setOnClosed(new EventHandler<Event>() {
            @Override
            public void handle(Event event) {// 设置TTY的GUI关闭事件
                removeTtyById(tty.getId());
            }
        });
        return tty;
    }

    /**
     * 查询当前的tty总数量
     * @return tty的数量
     */
    public Integer countTtys(){
        return ttyPool.size();
    }

    /**
     * 通过TTYID移除tty
     *
     * @param ttyId 要移除的TTYid
     */
    public void removeTtyById(String ttyId) {
        Tty tty = ttyPool.get(ttyId);
//        tty.getContainer().getEngine().load("http://www.baidu.com");
        ttyPool.remove(ttyId);
        int index = ttyList.indexOf(ttyId);
        consoleTabPane.getTabs().remove(index);
        ttyList.remove(index);
    }

    /**
     * 通过TTY ID 获取TTY对象
     *
     * @param ttyId 要获取的tty的id
     * @return 获取到的tty对象
     */
    public Tty getTtyById(String ttyId) {
        return ttyPool.get(ttyId);
    }

    public Tty getDefaultTty() {
        return defaultTty;
    }

    public void setDefaultTty(Tty defaultTty) {
        this.defaultTty = defaultTty;
    }
}
