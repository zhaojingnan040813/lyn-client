<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <!-- 头部标题 -->
      <header class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Tailwind CSS 测试页面
        </h1>
        <p class="text-lg text-gray-600">欢迎使用 Vue 3 + Element Plus + Tailwind CSS 应用</p>
      </header>

      <!-- 卡片展示区域 -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <!-- 颜色测试卡片 -->
        <div class="bg-white rounded-lg shadow-lg p-6 transform transition-transform duration-200 hover:scale-105">
          <h2 class="text-xl font-semibold text-blue-600 mb-3">颜色测试</h2>
          <div class="space-y-2">
            <div class="h-8 bg-red-500 rounded"></div>
            <div class="h-8 bg-green-500 rounded"></div>
            <div class="h-8 bg-blue-500 rounded"></div>
            <div class="h-8 bg-purple-500 rounded"></div>
          </div>
        </div>

        <!-- 字体测试卡片 -->
        <div class="bg-white rounded-lg shadow-lg p-6 transform transition-transform duration-200 hover:scale-105">
          <h2 class="text-xl font-semibold text-green-600 mb-3">字体测试</h2>
          <div class="space-y-2">
            <p class="text-sm font-light">Light 文本</p>
            <p class="text-base font-normal">Normal 文本</p>
            <p class="text-lg font-medium">Medium 文本</p>
            <p class="text-xl font-bold">Bold 文本</p>
          </div>
        </div>

        <!-- 布局测试卡片 -->
        <div class="bg-white rounded-lg shadow-lg p-6 transform transition-transform duration-200 hover:scale-105">
          <h2 class="text-xl font-semibold text-purple-600 mb-3">布局测试</h2>
          <div class="grid grid-cols-2 gap-2">
            <div class="h-12 bg-gray-200 rounded flex items-center justify-center text-xs">1</div>
            <div class="h-12 bg-gray-300 rounded flex items-center justify-center text-xs">2</div>
            <div class="h-12 bg-gray-400 rounded flex items-center justify-center text-xs">3</div>
            <div class="h-12 bg-gray-500 rounded flex items-center justify-center text-xs text-white">4</div>
          </div>
        </div>
      </section>

      <!-- 按钮测试区域 -->
      <section class="flex flex-wrap gap-4 justify-center mb-12">
        <button class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md">
          主要按钮
        </button>
        <button class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-md">
          成功按钮
        </button>
        <button class="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 shadow-md">
          警告按钮
        </button>
        <button class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md">
          危险按钮
        </button>
      </section>

      <!-- 表单测试区域 -->
      <section class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">表单测试</h2>
        <form class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">用户名</label>
            <input 
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="请输入用户名"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
            <input 
              type="email" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="请输入邮箱"
            />
          </div>
          <button 
            type="submit" 
            class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
          >
            提交表单
          </button>
        </form>
      </section>

      <!-- 响应式测试 -->
      <section class="mt-12 p-6 bg-white rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">响应式测试</h2>
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 bg-blue-100 p-4 rounded text-center">
            <span class="sm:hidden">移动端显示</span>
            <span class="hidden sm:inline lg:hidden">平板显示</span>
            <span class="hidden lg:inline">桌面端显示</span>
          </div>
          <div class="flex-1 bg-green-100 p-4 rounded text-center">
            <span class="text-xs sm:text-sm lg:text-base">响应式字体大小</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
// Tailwind CSS 测试脚本
console.log('Tailwind CSS 已成功加载！')

// 可以添加一些交互逻辑
const handleMouseMove = (event) => {
  const x = event.clientX / window.innerWidth
  const y = event.clientY / window.innerHeight
  document.documentElement.style.setProperty('--mouse-x', x.toString())
  document.documentElement.style.setProperty('--mouse-y', y.toString())
}

if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', handleMouseMove)
}
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
}

/* 自定义CSS变量用于动态效果 */
:root {
  --mouse-x: 0.5;
  --mouse-y: 0.5;
}

/* 添加一些高级的CSS效果来配合Tailwind */
.bg-gradient-to-br {
  background: linear-gradient(
    to bottom right,
    rgb(239 246 255),
    rgb(224 231 255)
  );
}

/* 鼠标跟随效果（可选） */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.transform:hover {
  animation: float 2s ease-in-out infinite;
}
</style>
