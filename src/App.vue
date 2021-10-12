<template>
  <div
    class="max-w-2xl min-h-screen px-4 pt-16 pb-24 mx-auto bg-white md:max-w-3xl xl:max-w-4xl lg:px-24"
  >
    <header>
      <h1
        class="text-3xl font-bold text-center text-black md:text-4xl xl:text-5xl font-display"
      >
        <span class="text-4xl text-primary md:text-5xl xl:text-6xl">P</span
        >atreon
        <span class="text-4xl text-primary md:text-5xl xl:text-6xl">P</span
        >ledges Calculator
      </h1>

      <div
        class="mt-4 text-xl font-medium text-center md:text-2xl text-secondary"
      >
        <p v-if="!creatorsLoaded">Find out how much you've pledged!</p>
        <p v-else>This is how much you've pledged!</p>
      </div>
    </header>
    <main class="mt-10 text-black font-body lg:mt-12">
      <section v-if="!creatorsLoaded">
        <p class="mb-1 text-xl font-bold">Follow these steps</p>

        <div class="pt-4 pb-6 border border-light-gray">
          <ol class="px-4 ml-5 space-y-4 text-lg list-decimal">
            <li>
              Make sure you are logged into Patreon in the current browser.
            </li>
            <li>
              Open this
              <a
                :href="link"
                rel="noopener"
                target="_blank"
                class="underline text-blue"
                >link</a
              >.
            </li>
            <li>Copy and paste the text data below.</li>
          </ol>
          <form @submit.prevent="calcPledges">
            <textarea
              class="w-full p-2 mt-2 border-t border-b resize-none border-light-gray"
              rows="7"
              placeholder="Paste content here"
              required
              v-model="jsonString"
              data-cy="json-textarea"
            ></textarea>
            <button
              class="block px-5 py-2 mx-auto mt-3 font-medium text-white rounded-full bg-primary"
              data-cy="json-button"
            >
              Calculate Pledges
            </button>
            <p v-if="errorMessage" class="py-2 text-xl font-bold text-red-dark">
              ⚠️ {{ errorMessage }}
            </p>
          </form>
        </div>
      </section>
      <section v-else>
        <p class="text-lg font-medium text-center md:text-xl xl:text-2xl">
          You have pledged a total amount of <br />
          <span class="font-bold">{{ totalSpent }}</span>
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
            <Creator
              v-bind="creator"
              class="p-4"
              :currency="selectedCurrency"
            />
          </li>
        </transition-group>
      </section>
    </main>
  </div>
</template>

<script>
import { formatDistanceStrict } from "date-fns"
import sortBy from "lodash.sortby"
import toUSD from "./utils/toUSD"

import Creator from "./components/Creator.vue"

export default {
  components: {
    Creator,
  },
  data() {
    return {
      jsonString: "",
      creators: [],
      errorMessage: "",
      creatorsLoaded: false,
      interval: null,
      sortBy: "time",
      selectedCurrency: "USD",
      link:
        "https://www.patreon.com/api/bills?use-defaults-for-included-resources=false&include=post.campaign.null%2Ccampaign.null%2Ccard.pledges.campaign.null&fields[campaign]=avatar_photo_url%2Ccover_photo_url%2Cname%2Cpay_per_name%2Cpledge_url%2Curl&fields[post]=title%2Cpublished_at%2Cthumbnail%2Curl%2Cpledge_url&fields[bill]=status%2Camount_cents%2Ccreated_at%2Cvat_charge_amount_cents%2Cmonthly_payment_basis%2Cbill_type%2Ccurrency&fields[patronage_purchase]=amount_cents%2Ccreated_at%2Cvat_charge_amount_cents%2Cmerchant_name%2Ccurrency%2Cjson-api-version=1.0",
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
    /* Calculate Total pledges among all creators */
    totalSpent() {
      const formatCurrency = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: this.selectedCurrency,
        maximumFractionDigits: 0,
      })
      const cents = this.creators.reduce(
        (total, creator) => (total += creator.pledged),
        0
      )
      const units = cents / 100
      return formatCurrency.format(units)
    },
  },
  methods: {
    calcPledges() {
      this.errorMessage = ""
      let json
      try {
        json = JSON.parse(this.jsonString)
      } catch (e) {
        console.error(e)
        this.errorMessage = "Invalid JSON"
        return
      }

      if (!json.data && !json.included) {
        this.errorMessage =
          "Unexpected JSON structure: 'data' and/or 'included' properties are missing)"
        return
      }

      const pledges = json.data
      const creatorsMixed = json.included

      this.creators = creatorsMixed
        .filter((creatorMix) => creatorMix.type === "campaign")
        .map((creator) => {
          const dates = []

          const pledged = pledges.reduce((total, pledge) => {
            // Only add up pledges to belonging to the current iterated creator
            if (pledge.relationships.campaign.data.id !== creator.id)
              return total

            dates.push(pledge.attributes.created_at)

            const currency = pledge.attributes?.currency
            let amountCents = pledge.attributes.amount_cents

            // If pledge currency doesn't match user selected currency, then convert it
            if (currency && currency !== this.selectedCurrency) {
              amountCents = toUSD({ currency, amount: amountCents })
            }

            return (total += amountCents)
          }, 0)

          const mostRecentPledge = dates.sort()[dates.length - 1]

          return {
            name: creator.attributes.name,
            photo: creator.attributes.avatar_photo_url.replace("&amp;", "&"),
            id: creator.id,
            url: creator.attributes.url,
            pledged,
            mostRecentPledge,
          }
        })

      /* Calculate period between first and last pledge */

      if (pledges.length >= 2) {
        const pledgeDates = pledges
          .map((pledge) => pledge.attributes.created_at)
          .sort()

        this.interval = formatDistanceStrict(
          new Date(pledgeDates[0]),
          new Date(pledgeDates[pledges.length - 1])
        )
      }
      /* ************** */

      this.creatorsLoaded = true
    },
  },
}
</script>
