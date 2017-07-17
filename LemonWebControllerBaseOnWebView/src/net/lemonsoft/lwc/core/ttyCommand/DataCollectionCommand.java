package net.lemonsoft.lwc.core.ttyCommand;

import net.lemonsoft.lwc.core.SubController;

/**
 * 数据收集命令
 * Created by LiuRi on 16/8/21.
 */
public class DataCollectionCommand {

    private SubController belongSubController;

    public DataCollectionCommand(SubController controller) {
        super();
        this.belongSubController = controller;
    }

    public void init(String columns){

    }

//    /**
//     * 将数据放置到数据收集池中
//     *
//     * @param key   数据的键
//     * @param value 数据的值
//     */
//    public void put(String key, Object value) {
//        belongSubController.putData(key, value);
//    }

    public void addRow(String row){
        belongSubController.addRow(row);
    }

    /**
     * 获取指定的数据
     *
     * @param index 要获取的数据的索引
     * @return 要获取的数据
     */
    public String get(int index) {
        return belongSubController.getDataCollectionPool().get(index);
    }

    /**
     * 删除指定的数据
     *
     * @param index 要删除的数据的索引
     * @return 删除的数据值
     */
    public String remove(int index) {
        String row = belongSubController.getDataCollectionPool().get(index);
        belongSubController.removeData(index);
        return row;
    }

    /**
     * 移除所有的采集数据
     */
    public void removeAll() {
        belongSubController.removeAllData();
    }

}
