### Cursor中文版开发贪食蛇小游戏
本项目主要是体验Cursor中文版的代码生成效果和能力

![HTML](https://img.shields.io/badge/HTML-3.0+-green.svg)  ![CSS](https://img.shields.io/badge/CSS-3.0+-orange.svg)  ![JavaScript](https://img.shields.io/badge/JavaScript-3.0+-blue.svg)  ![Sonnet3.5](https://img.shields.io/badge/Sonnet-3.5+-pink.svg)

![image](https://github.com/user-attachments/assets/5e11c9f5-ccaf-4270-b62b-b52854e6493b)

![image](https://github.com/user-attachments/assets/2431eb6c-cc55-4ced-93a8-aa039cc51d72)

一共对话2次，生成效果还可以，可以看到Cursor的上下文理解能力还是比较强的，没有影响到之前的代码，也没有乱瞎改，这点比Trae要好很多,完全就是吊打。提示词如下

```java
根据图片生成一个贪食蛇的小游戏
1.图片文件里面有3个图片，分别是蛇头snake身体body食物monster
2.mp3文件里面有2个音频，吃食物的时候播放eat，游戏结束播放over
3.页面分为左中右3部分布局，左面显示开始按钮，难度选择，分数，得分；中间部分显示游戏界面，右边部分显示排行榜
4.游戏得分根据游戏难度的不同而不同，分为简单，困难，地狱3种级别，对应的是1,2,3分
5.排行榜从缓存获取，每次游戏结束后更新排行榜数据TOP10
6.蛇碰到身体，墙壁游戏结束，食物随机生成，不能与蛇和身体重合
7.界面样式美观，炫酷，好看，加一些特效
```

![snake](https://github.com/user-attachments/assets/70c3b2bc-ba6b-4040-8711-a2e8427d7498)
