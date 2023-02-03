<template>
  <div class="rank-mode-switcher">
    <div class="rank-mode-switcher-body">
      <div class="rank-mode-item-row">
        <div :class="{ 'rank-mode-item': true, 'rank-mode-item-picked': mode === 'day' }" @click="handleClick('day')">
          <span>日排行榜</span>
        </div>

        <div :class="{ 'rank-mode-item': true, 'rank-mode-item-picked': mode === 'week' }" @click="handleClick('week')">
          <span>周排行榜</span>
        </div>
        <div :class="{ 'rank-mode-item': true, 'rank-mode-item-picked': mode === 'month' }"
          @click="handleClick('month')">
          <span>月排行榜</span>
        </div>
      </div>
      <div class="rank-mode-item-row">
        <div :class="{ 'rank-mode-item': true, 'rank-mode-item-picked': mode === 'day_male' }"
          @click="handleClick('day_male')">
          <span>男性热榜</span>
        </div>
        <div :class="{ 'rank-mode-item': true, 'rank-mode-item-picked': mode === 'day_female' }"
          @click="handleClick('day_female')">
          <span>女性热榜</span>
        </div>
        <div :class="{ 'rank-mode-item': true, 'rank-mode-item-picked': mode === 'week_original' }"
          @click="handleClick('week_original')">
          <span>原创周榜</span>
        </div>
        <div :class="{ 'rank-mode-item': true, 'rank-mode-item-picked': mode === 'week_rookie' }"
          @click="handleClick('week_rookie')">
          <span>新人周榜</span>
        </div>
      </div>
      <div class="rank-mode-item-row">
        <div :class="{ 'rank-mode-item': true, 'rank-mode-item-picked': mode === 'day_ai' }"
          @click="handleClick('day_ai')">
          <span>AI 日榜</span>
        </div>
        <div :class="{ 'rank-mode-item': true, 'rank-mode-item-picked': mode === 'day_r18' }"
          @click="handleClick('day_r18')">
          <span>R18 日榜</span>
        </div>
        <div :class="{ 'rank-mode-item': true, 'rank-mode-item-picked': mode === 'day_r18_ai' }"
          @click="handleClick('day_r18_ai')">
          <span>R18-AI 日榜</span>
        </div>
      </div>
      <div class="rank-mode-item-row">
        <div :class="{ 'rank-mode-item': true, 'rank-mode-item-picked': mode === 'day_male_r18' }"
          @click="handleClick('day_male_r18')">
          <span>R18 男性日榜</span>
        </div>
        <div :class="{ 'rank-mode-item': true, 'rank-mode-item-picked': mode === 'day_female_r18' }"
          @click="handleClick('day_female_r18')">
          <span>R18 女性日榜</span>
        </div>
        <div :class="{ 'rank-mode-item': true, 'rank-mode-item-picked': mode === 'week_r18' }"
          @click="handleClick('week_r18')">
          <span>R18 周榜</span>
        </div>
        <div :class="{ 'rank-mode-item': true, 'rank-mode-item-picked': mode === 'week_r18g' }"
          @click="handleClick('week_r18g')">
          <span>R18-G 周榜</span>
        </div>
      </div>
      <div class="rank-mode-item-row">
        <div :class="{ 'rank-mode-item': true, 'rank-mode-item-picked': mode === 'day_manga' }"
          @click="handleClick('day_manga')">
          <span>漫画日榜</span>
        </div>
        <div :class="{ 'rank-mode-item': true, 'rank-mode-item-picked': mode === 'week_manga' }"
          @click="handleClick('week_manga')">
          <span>漫画周榜</span>
        </div>
        <div :class="{ 'rank-mode-item': true, 'rank-mode-item-picked': mode === 'month_manga' }"
          @click="handleClick('month_manga')">
          <span>漫画月榜</span>
        </div>
      </div>
      <div class="rank-mode-item-row">
        <div :class="{ 'rank-mode-item': true, 'rank-mode-item-picked': mode === 'week_rookie_manga' }"
          @click="handleClick('week_rookie_manga')">
          <span>漫画新人周榜</span>
        </div>
        <div :class="{ 'rank-mode-item': true, 'rank-mode-item-picked': mode === 'day_r18_manga' }"
          @click="handleClick('day_r18_manga')">
          <span>R18 漫画日榜</span>
        </div>
        <div :class="{ 'rank-mode-item': true, 'rank-mode-item-picked': mode === 'week_r18_manga' }"
          @click="handleClick('week_r18_manga')">
          <span>R18 漫画周榜</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Rank.ModeSwitcher',
  props: ['mode'],
  methods: {
    handleClick(mode) {
      this.$emit('mode-changed', mode);
    },
  },
};
</script>
