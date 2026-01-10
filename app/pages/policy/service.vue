<script setup lang="ts">
definePageMeta({
  layout: 'sub-page',
  title: "Notice.terms_of_service"
})
import type { PolicyPart } from '~/types/data.types';
import ArticleSlot from './components/ArticleSlot.vue';

const title = "Service.iscim_terms_and_conditions";
const Service: PolicyPart[] = [
  {
    title: "Service.terms_of_service",
    content: "Service.terms_of_service_content",
    lists:[ 
      "Service.terms_of_service_list_1", 
      "Service.terms_of_service_list_2", 
      "Service.terms_of_service_list_3"
    ]
  },
  {
    title: "member",
    lists: [ 
      "Service.member_list_1", 
      "Service.member_list_2", 
      "Service.member_list_3", 
      "Service.member_list_4"
    ]
  },
  {
    title: "Service.member_login_information",
    lists: [
      "Service.member_login_information_list_1", 
      "Service.member_login_information_list_2", 
      "Service.member_login_information_list_3",
      "Service.member_login_information_list_4",
      "Service.member_login_information_list_5",
      "Service.member_login_information_list_6"
    ]
  },
  {
    title: "Service.use_behavior",
    content: "Service.use_behavior_content",
    lists: [
      "Service.use_behavior_list_1",
      "Service.use_behavior_list_2",
      "Service.use_behavior_list_3",
      "Service.use_behavior_list_4",
      "Service.use_behavior_list_5"
    ]
  },
  {
    title: "Service.exclusive_rights_of_this_site",
    lists: [
      "Service.exclusive_rights_of_this_site_list_1",
      "Service.exclusive_rights_of_this_site_list_2",
      "Service.exclusive_rights_of_this_site_list_3",
      "Service.exclusive_rights_of_this_site_list_4",
      "Service.exclusive_rights_of_this_site_list_5",
      "Service.exclusive_rights_of_this_site_list_6",
      "Service.exclusive_rights_of_this_site_list_7"
    ]
  },
  {
    title: "Service.termination_of_membership",
    content: "Service.termination_of_membership_content"
  },
  {
    title: "Service.disclaimer",
    content: "Service.disclaimer_content",
    lists: [
      "Service.disclaimer_list_1",
      "Service.disclaimer_list_2",
      "Service.disclaimer_list_3",
      "Service.disclaimer_list_4",
      "Service.disclaimer_list_5",
      "Service.disclaimer_list_6",
      "Service.disclaimer_list_7",
      "Service.disclaimer_list_8",
      "Service.disclaimer_list_9"
    ]
  },
  {
    title: "Service.right_of_modification",
    lists: [
      "Service.right_of_modification_list_1",
      "Service.right_of_modification_list_2"
    ]
  },
  {
    title: "Service.intellectual_property_rights_modification",
    lists: [
      "Service.intellectual_property_rights_modification_list_1",
      "Service.intellectual_property_rights_modification_list_2"
    ]
  },
  {
    title: "Service.other_regulations",
    lists: [
      "Service.other_regulations_list_1",
      "Service.other_regulations_list_2",
      "Service.other_regulations_list_3"
    ]
  },
  {
    title: "Service.membership_termination_and_obligation_to_notify_this_site",
    lists: [
      "Service.membership_termination_and_obligation_to_notify_this_site_list_1",
      "Service.membership_termination_and_obligation_to_notify_this_site_list_2",
      "Service.membership_termination_and_obligation_to_notify_this_site_list_3",
      "Service.membership_termination_and_obligation_to_notify_this_site_list_4"
    ]
  },
  {
    title: "Service.instructions_for_purchasing_ipoints",
    lists: [
      "Service.instructions_for_purchasing_ipoints_list_1",
      "Service.instructions_for_purchasing_ipoints_list_2",
      "Service.instructions_for_purchasing_ipoints_list_3",
      "Service.instructions_for_purchasing_ipoints_list_4",
      "Service.instructions_for_purchasing_ipoints_list_5"
    ]
  },
  {
    title: "Policy.contact",
    content: "Policy.contact_content"
  }
];

</script>

<template>
  <div class="policy__container">
    <article-slot 
      :title="title"
      title-class="title"
      :article="Service"
    />
  </div>
</template>

<style scoped></style>
