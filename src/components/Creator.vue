<template>
  <div>
    <!--  alt="" is better for screen readers since the name is already stated below-->
    <img
      :src="photo"
      alt=""
      class="w-24 h-24 mx-auto border-2 rounded-full border-light-gray"
    />

    <a
      :href="url"
      target="_blank"
      class="block mt-2 text-lg font-medium text-center text-secondary hover:underline"
      >{{ name }}</a
    >

    <p class="text-xl font-medium text-center" data-cy="pledged">
      {{ formatPledge(pledged)
      }}<a v-if="conversionTimes" href="#conversion-notice">*</a>
    </p>
  </div>
</template>

<script>
export default {
  name: "Creator",
  props: {
    name: {
      type: String,
      default: "",
      required: true,
    },
    photo: {
      type: String,
      default: "",
      required: true,
    },
    pledged: {
      type: Number,
      default: 0,
      required: true,
    },
    url: {
      type: String,
      default: "https://www.patreon.com",
      required: true,
    },
    conversionTimes: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  methods: {
    formatPledge(cents) {
      const dollars = (cents / 100).toFixed(0)
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(dollars)
    },
  },
}
</script>
