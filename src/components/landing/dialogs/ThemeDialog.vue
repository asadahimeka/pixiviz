<template>
  <el-dialog
    class="dialog dialog-theme"
    title="设置"
    :width="dialogWidth"
    :visible.sync="show"
    append-to-body
  >
    <el-form label-position="left" :label-width="labelWidth" :model="themeForm">
      <el-form-item label="颜色主题">
        <el-switch
          v-model="themeForm.darkMode"
          active-color="#2e2e2e"
          inactive-color="#E3A7A1"
          active-text="暗色"
          inactive-text="浅色"
          @change="themeChanged"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="模式">
        <el-switch
          v-model="themeForm.darkPersist"
          active-color="#2e2e2e"
          inactive-color="#3e3e3e"
          active-text="固定颜色"
          inactive-text="自动切换"
          :disabled="!themeForm.darkMode"
          @change="themeModeChanged"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="显示 NSFW 内容" label-width="140px">
        <el-switch
          :value="$store.state.showNSFW"
          active-text="是"
          inactive-text="否"
          @change="nsfwChanged"
        >
        </el-switch>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import dayjs from 'dayjs';
import settingsDialog from '../../../mixin/settingDialog';

export default {
  data() {
    return {
      show: false,
      themeForm: {
        darkMode: false,
        darkPersist: false, // 永久禁用
      },
      screenWidth: document.documentElement.clientWidth,
    };
  },
  mixins: [settingsDialog],
  computed: {
    labelWidth() {
      if (this.screenWidth <= 320) {
        return '72px';
      } else {
        return '80px';
      }
    },
  },
  created() {
    window.addEventListener('resize', this.windowResized);
    const darkEnabled = window.localStorage.getItem('enable-dark');
    this.themeForm.darkMode = darkEnabled === 'true';
    const darkPersist = window.localStorage.getItem('dark-persist');
    this.themeForm.darkPersist = darkPersist === 'true';
  },
  methods: {
    open() {
      this.show = true;
    },
    themeChanged(value) {
      if (value) {
        const now = dayjs();
        const hour = now.hour();
        if (!this.themeForm.darkPersist) {
          if (hour < 6 || hour >= 18) {
            this.enableDarkMode();
          } else {
            this.disableDarkMode();
          }
        } else {
          this.enableDarkMode();
        }
      } else {
        this.disableDarkMode();
      }
    },
    themeModeChanged(value) {
      if (value) {
        // 永久黑暗模式
        this.addDarkClass();
      } else {
        // 自动黑暗模式
        const now = dayjs();
        const hour = now.hour();
        if (hour >= 6 && hour < 18) {
          this.removeDarkClass();
        }
      }
      window.pixiviz.darkPersist = value;
      window.localStorage.setItem('dark-persist', value);
    },
    nsfwChanged(value) {
      if (value) {
        this.$confirm('确定要开启 NSFW 作品显示吗？请确保您的年龄已满18岁，且未违反当地法律法规所规定的内容。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          localStorage.setItem('pz_showNSFW', 1)
          setTimeout(() => {
            location.reload()
          }, 200)
        })
      } else {
        localStorage.removeItem('pz_showNSFW')
        setTimeout(() => {
          location.reload()
        }, 200)
      }
    },
    enableDarkMode() {
      this.$bus.$emit('dark-mode-enable');
    },
    disableDarkMode() {
      this.$bus.$emit('dark-mode-disable');
    },
    windowResized() {
      this.screenWidth = document.documentElement.clientWidth;
    },
  },
};
</script>

<style scoped lang="less">
.dialog-theme {
  ::v-deep .el-form-item__content .el-switch {
    top: -3px;
  }
}
</style>
