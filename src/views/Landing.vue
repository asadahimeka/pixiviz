<template>
  <div class="landing-container">
    <div class="landing" v-lazy:background-image="landingBG">
      <!-- <div class="landing-content">
        <BannerPlaceholder class="landing-card" ref="bannerPlaceholder" />
        <SearchPlaceholder class="landing-card" />
        <RankPlaceholder class="landing-card" />
      </div> -->
      <div class="landing-real-content">
        <Banner class="landing-card" @expanded="handleExpanded" />
        <SearchBox class="landing-card" />
        <RankBox class="landing-card" />
      </div>
    </div>
    <el-dialog
      :title="announceTitle"
      :visible.sync="showAnnounce"
      :before-close="handleAnnounceClose"
      class="landing-announcement"
      top="8.5vh"
    >
      <pre v-html="announceContent"></pre>
      <pre class="announce-footer">{{ announceFooter }}</pre>
    </el-dialog>
  </div>
</template>

<script>
// components
import Banner from '../components/landing/Banner';
import SearchBox from '../components/landing/SearchBox';
import RankBox from '../components/landing/RankBox';
// placeholder
// import BannerPlaceholder from '../components/landing/BannerPlaceholder';
// import SearchPlaceholder from '../components/landing/SearchBoxPlaceholder';
// import RankPlaceholder from '../components/landing/RankBoxPlaceholder';
// utils
import { checkTrustHost } from '../util/host';

import { version } from '../version';
import { waitForRemoteConfig } from '@/util/config';

export default {
  name: 'Landing',
  components: {
    Banner,
    SearchBox,
    RankBox,
    // BannerPlaceholder,
    // SearchPlaceholder,
    // RankPlaceholder,
  },
  data() {
    return {
      staticLandingBG: require(`@/assets/images/98606454.jpg`),
      landingBG: require(`@/assets/images/98606454.jpg`),
      guideNotice: null,
      notFirstUse: false,
      announceId: -1,
      announceTitle: '',
      announceFooter: '',
      showAnnounce: false,
      announceContent: false,
    };
  },
  created() {
    document.title = 'Pixiviz';
    this.fetchLandingBg()
  },
  async mounted() {
    if (!checkTrustHost(this.$config)) {
      return;
    }
    if (!window.pixiviz?.config?.IS_REMOTE_CONFIG) {
      // delay for waiting for fetching remote config
      await waitForRemoteConfig(5);
    }
    if (this.$config?.check_announce) {
      this.fetchAnnounce();
    }
    if (this.$config?.show_guide) {
      this.checkFirstUse();
    }
    if (this.$config?.show_donate) {
      this.displayDonate();
    }
  },
  beforeDestroy() {
    if (this.guideNotice) {
      this.guideNotice.close();
    }
    if (this.donateNotice) {
      this.donateNotice.close();
    }
  },
  methods: {
    // event
    handleExpanded(expanded) {
      if (!this.$refs.bannerPlaceholder) {
        return;
      }
      this.$refs.bannerPlaceholder.expandedChanged(expanded);
    },
    // announce
    checkVersionMatch(vers) {
      for (const ver of vers) {
        if (!version.startsWith(ver)) {
          return false;
        }
      }
      return true;
    },
    checkLastVisitTime(timeLimit) {
      const record = window.localStorage.getItem('last-visit-time');
      if (!record) {
        return false;
      }
      const recordTime = parseInt(record, 10);
      return recordTime >= timeLimit;
    },
    async fetchLandingBg() {
      const cachedBg = sessionStorage.getItem('__home-bg')
      if (cachedBg) {
        this.landingBG = cachedBg
        return
      }
      try {
        const url = '/prks/now/ajax/illust/discovery'
        const res = await this.axios.get(url, {
          baseURL: '/',
          params: {
            mode: 'safe',
            max: 1
          }
        })
        let bg = res.data.illusts.filter(e => !e.isAdContainer)[0].url
        bg = `https://nfn.kanata.ml/pximg${bg.replace(/\/-\/c\/\d+x\d+.*\/.*\/img\//i, '/img-master/img/').replace(/(_p\d+_)\w+1200/, '$1master1200')}`
        let img = new Image()
        img.onload = () => {
          setTimeout(() => {
            this.landingBG = bg
            sessionStorage.setItem('__home-bg', bg)
          }, 200)
          img = null
        }
        img.src = bg
      } catch (error) {
        this.landingBG = this.staticLandingBG
      }
    },
    async fetchAnnounce() {
      let res;
      try {
        res = await this.axios.get(
          process.env.NODE_ENV === 'development'
            ? 'https://cfs.tigo.pwp.app/pixiviz-anno-dev.json'
            : this.$config.announcement_feed,
          {
            withCredentials: false,
          },
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Fetch remote announcement failed', err);
      }
      if (!res.data) {
        return;
      }
      for (const announcement of res.data) {
        const {
          id,
          title,
          content,
          footer,
          start,
          expires,
          matchVersion,
          lastVisitAfter,
        } = announcement;
        const announceLog = window.localStorage.getItem('announce-read-id');
        // check conditions
        const started = start ? start <= Date.now() : true;
        const expired = expires ? expires < Date.now() : true;
        const versionMatched = matchVersion ? this.checkVersionMatch(matchVersion) : true;
        const visitAfter = lastVisitAfter ? this.checkLastVisitTime(lastVisitAfter) : true;
        if (
          (announceLog && parseInt(announceLog, 10) >= parseInt(id, 10)) ||
          !started ||
          expired ||
          !versionMatched ||
          !visitAfter
        ) {
          continue;
        }
        this.announceId = id;
        this.announceTitle = title;
        this.announceContent = content;
        this.announceFooter = footer;
        this.showAnnounce = true;
        break;
      }
    },
    handleAnnounceClose(done) {
      window.localStorage.setItem('announce-read-id', this.announceId);
      done();
    },
    // notification
    checkFirstUse() {
      if (!window.localStorage) {
        return;
      }
      const notFirstUse = window.localStorage.getItem('not-first-use');
      if (notFirstUse === 'true') {
        this.notFirstUse = true;
        return;
      }
      document.body.addEventListener('click', this.guideNoticeClicked, false);
      window.localStorage.setItem('not-first-use', true);
      this.$nextTick(() => {
        this.guideNotice = this.$notify({
          title: '',
          position: 'top-right',
          customClass: 'oneline-notice-container',
          dangerouslyUseHTMLString: true,
          duration: 8000,
          onClose: this.guideNoticeClosed,
          message: `
          <div class="oneline-notice">
            <span data-name="notice-firstuse">第一次来到 Pixiviz？你可能需要<span class="notice-link" data-name="link-guide">食用指南</span></span>
          </div>`,
        });
      });
    },
    displayDonate() {
      if (!this.notFirstUse) {
        return;
      }
      // 同一个设备5天内只展示一次
      const lastShowDonate = window.localStorage.getItem('last-show-donate');
      if (lastShowDonate && (Date.now() - parseInt(lastShowDonate, 10)) / 1000 <= 86400 * 5) {
        return;
      }
      // 75%的概率展示通知
      if (Math.random() <= 0.75) {
        window.localStorage.setItem('last-show-donate', Date.now());
        document.body.addEventListener('click', this.donateNoticeClicked, false);
        this.$nextTick(() => {
          this.donateNotice = this.$notify({
            title: '',
            position: 'top-right',
            customClass: 'oneline-notice-container',
            dangerouslyUseHTMLString: true,
            duration: 15000,
            onClose: this.donateNoticeClosed,
            message: `
							<div class="oneline-notice">
								<span data-name="notice-donate">有了大家的发电，服务姬就能健康地活下去了，广告什么的才不上呢！ -&gt; <span class="notice-link" data-name="link-donate">点这里即刻投喂服务姬</span></span>
							</div>`,
          });
        });
      }
    },
    guideNoticeClicked(e) {
      if (e.target.dataset.name && e.target.dataset.name === 'link-guide') {
        if (window.isSafari) {
          window.location.href = this.$config.guide_url;
        } else {
          window.open(this.$config.guide_url, '_blank');
        }
        this.guideNotice.close();
      }
    },
    guideNoticeClosed() {
      document.body.removeEventListener('click', this.guideNoticeClicked, false);
    },
    donateNoticeClicked(e) {
      if (e.target.dataset.name && e.target.dataset.name === 'link-donate') {
        if (window.isSafari) {
          window.location.href = this.$config.donate_url;
        } else {
          window.open(this.$config.donate_url, '_blank');
        }
        this.donateNotice.close();
      }
    },
    donateNoticeClosed() {
      document.body.addEventListener('click', this.donateNoticeClicked, false);
    },
  },
};
</script>

<style scoped lang="less">
.landing-container{
  padding: 0;

  .landing {
    position: relative;
    max-width: 100vw;
    height: 100vh;
    border-radius: 0;
    background-position: center center;
    background-size: cover;
    filter: none;

    &::after {
      content: '';
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.2);
    }

    .landing-card {
      margin-bottom: 0;
      border-radius: 0;
      box-shadow: none;
    }
  }

  .landing-real-content {
    position: relative;
    z-index: 2;
  }
}
</style>
