<template>
  <section>
    <p
      class="px-6 py-4 mx-auto text-lg font-medium text-center border md:text-xl xl:text-2xl border-light-gray"
      style="width: fit-content"
    >
      You have pledged a total amount of <br />
      <span>about {{ totalSpent }}</span>
      <span v-if="interval"> over {{ interval }}</span
      >.
    </p>
    <div class="flex justify-end mt-8">
      <label for="sort-creators" class="text-secondary">Sort by</label
      ><select
        id="sort-creators"
        v-model="sortBy"
        data-cy="sort-creators"
        class="outline-none focus-visible:ring"
      >
        <option value="time">recently pledged</option>
        <option value="amount">highest pledged</option>
      </select>
    </div>

    <transition-group
      tag="ul"
      class="flex flex-wrap justify-center gap-4 mt-2"
      data-cy="creators-list"
      move-class="motion-safe:duration-1000 motion-safe:ease-in-out"
    >
      <li
        v-for="creator in sortedCreators"
        :key="creator.id"
        class="w-40 border border-light-gray"
      >
        <Creator v-bind="creator" class="p-4" />
      </li>
    </transition-group>

    <p
      id="conversion-notice"
      class="mt-8 text-sm text-secondary"
      v-if="showConversionNotice"
    >
      *One or more pledges was converted to USD using
      <a
        href="https://github.com/mornir/patreon-pledges-calculator/blob/master/src/utils/toUSD.js"
        target="_blank"
        class="underline text-blue"
      >
        these fixed exchange rates</a
      >.
    </p>
  </section>
</template>

<script>
import sortBy from "lodash.sortby"
import Creator from "./Creator.vue"
export default {
  name: "CreatorsList",
  props: {
    creators: {
      type: Array,
      default: () => [],
      required: true,
    },
    interval: {
      type: String,
      default: "",
      required: true,
    },
  },
  components: {
    Creator,
  },
  data() {
    return {
      sortBy: "time",
      totalSpent: null,
      showConversionNotice: false,
    }
  },
  computed: {
    sortedCreators() {
      if (this.sortBy === "time") {
        return sortBy(this.creators, ["mostRecentPledge"]).reverse()
      } else {
        return sortBy(this.creators, ["pledged"]).reverse()
      }
    },
  },
  created() {
    /* Calculate Total pledges among all creators */
    const formatCurrency = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    })
    const cents = this.creators.reduce(
      (total, creator) => (total += creator.pledged),
      0
    )
    const units = cents / 100
    this.totalSpent = formatCurrency.format(units)

    this.showConversionNotice = this.creators.some(
      (creator) => creator.conversionTimes !== 0
    )
  },
}
</script>
