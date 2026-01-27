<script setup lang="ts">
import type { PolicyPart } from '~/types/data.types';

const title = "Privacy.welcome";
const privacy: PolicyPart[] = [
  {
    title: "Privacy.scope_of_application_of_the_privacy_Policy",
    content: "Privacy.scope_of_application_of_the_privacy_Policy_content"
  },
  {
    title: "Privacy.collection_processing_and_utilization_of_personal_data",
    lists: [
      "Privacy.collection_processing_and_utilization_of_personal_data_list_1",
      "Privacy.collection_processing_and_utilization_of_personal_data_list_2",
      "Privacy.collection_processing_and_utilization_of_personal_data_list_3",
      "Privacy.collection_processing_and_utilization_of_personal_data_list_4",
      "Privacy.collection_processing_and_utilization_of_personal_data_list_5"
    ]
  },
  {
    title: "Privacy.data_protection",
    lists: [
      "Privacy.data_protection_list_1",
      "Privacy.data_protection_list_2"
    ]
  },
  {
    title: "Privacy.external_links_on_the_website",
    content: "Privacy.external_links_on_the_website_content"
  },
  {
    title: "Privacy.policy_on_sharing_personal_data_with_third_parties",
    contents: [
      "Privacy.policy_on_sharing_personal_data_with_third_parties_content_1",
      "Privacy.policy_on_sharing_personal_data_with_third_parties_content_2",
      "Privacy.policy_on_sharing_personal_data_with_third_parties_content_3",
      "Privacy.policy_on_sharing_personal_data_with_third_parties_content_4",
      "Privacy.policy_on_sharing_personal_data_with_third_parties_content_5"
    ],
    lists: [
      "Privacy.policy_on_sharing_personal_data_with_third_parties_list_1",
      "Privacy.policy_on_sharing_personal_data_with_third_parties_list_2",
      "Privacy.policy_on_sharing_personal_data_with_third_parties_list_3",
      "Privacy.policy_on_sharing_personal_data_with_third_parties_list_4",
      "Privacy.policy_on_sharing_personal_data_with_third_parties_list_5"
    ]
  },
  {
    title: "Privacy.use_of_cookies",
    content: "Privacy.use_of_cookies_content"
  },
  {
    title: "Privacy.amendments_to_privacy_policy",
    content: "Privacy.amendments_to_privacy_policy_content"
  },
  {
    title: "Policy.contact",
    content: "Policy.contact_content"
  }
];

const closePolicyPrivacy = () => {
  const mainStore = useMainStore();
  mainStore.setPolicyPrivacy(false);
};
</script>

<template>
  <div class="policy__container">
    <SubPageHeader 
      :title="$t('privacy_policy')"
      left-icon="arrow-down"
      @click-left="closePolicyPrivacy"
    />
    <PolicyContentSlot
      :title="title"
      :article="privacy"
    />
  </div>
</template>

<style scoped></style>
