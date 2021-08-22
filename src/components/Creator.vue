<template>
  <div>
    <img :src="photo" :alt="name" class="w-24 h-24 rounded-full" />
    <p class="text-center">{{ name }}</p>
    <p class="text-center">{{ formatPledge(pledged) }}</p>
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
