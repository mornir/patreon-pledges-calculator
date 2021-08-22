<template>
  <div>
    <img
      :src="photo"
      alt=""
      class="w-24 h-24 mx-auto border-2 rounded-full border-light-gray"
    />
    <p class="mt-2 text-lg font-medium text-center text-secondary">
      {{ name }}
    </p>
    <p class="text-xl font-medium text-center">{{ formatPledge(pledged) }}</p>
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
      default: "",
      required: true,
    },
  },
  methods: {
    formatPledge(cents) {
      const dollars = cents / 100
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(dollars)
    },
  },
}
</script>
