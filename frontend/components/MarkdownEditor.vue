<template>
  <div>
    <div class="columns">
      <div class="column">
        <h6 class="title is-6 mb-2">
          {{ editorName }}
        </h6>
        <div class="field">
          <textarea
            :value="computedValue"
            class="textarea is-family-code"
            :rows="rows"
            :disabled="disabled"
            @input="onInput"
            @change="onChange"
          />
          <p class="help">
            <b-icon icon="language-markdown-outline" class="mr-1" style="vertical-align: middle" /><span>This editor supports Markdown</span>
          </p>
        </div>
      </div>
      <div class="column">
        <h6 class="title is-6 mb-2">
          Preview
        </h6>
        <div class="card markdown-body markdown-body-preview" v-html="$md.render(computedValue)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EleosMarkdownEditor',
  props: {
    value: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    editorName: {
      type: String,
      default: 'Description'
    }
  },
  emits: ['update:modelValue'],
  data () {
    return {
      newValue: this.value
    }
  },
  computed: {
    computedValue: {
      get () {
        return this.newValue
      },
      set (value) {
        this.newValue = value
        this.$emit('input', value)
      }
    },
    rows () {
      return this.newValue ? Math.max(5, this.computedValue.split('\n').length) : 5
    }
  },
  methods: {
    onInput (event) {
      this.mdValue = this.$md.render(event.target.value)
      this.updateValue(event.target.value)
    },
    onChange (event) {
      this.mdValue = this.$md.render(event.target.value)
      this.updateValue(event.target.value)
    },
    updateValue (value) {
      this.computedValue = value
    }
  }
}
</script>

<style>
.markdown-body ul {
  list-style: revert;
}

.markdown-body-preview {
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 30px;
}

@media (max-width: 767px) {
  .markdown-body-preview {
    padding: 15px;
  }
}
</style>
