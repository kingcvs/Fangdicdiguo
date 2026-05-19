// 游戏主入口
(function() {
    // 确保DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMenu);
    } else {
        initMenu();
    }
    
    function initMenu() {
        console.log('🚀 房地产帝国 启动中...');
        
        // 初始化游戏状态
        GameState.init();
        
        // 初始化菜单系统
        MenuSystem.init();
        
        console.log('✅ 菜单已就绪！');
    }
})();
