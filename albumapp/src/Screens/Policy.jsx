import { StyleSheet, Text, ScrollView, View } from "react-native";
import ScreenWrapper from "../Components/ScreenWrapper";
import BackButton from "../Components/BackButton";
import { useNavigation } from "@react-navigation/native";
import { hp, wp } from "../helpers/Common";

const Policy = () => {
  const navigation = useNavigation();

  return (
    <ScreenWrapper bg={"white"}>
      <ScrollView contentContainerStyle={styles.container}>
        <BackButton navigation={navigation} />
        <Text style={styles.title}>Privacy Policy</Text>

        <Text style={styles.heading}>Introduction</Text>
        <Text style={styles.text}>
          At Shaadi Album, we value your privacy and are committed to protecting
          the personal information you share with us. This Privacy Policy
          explains how we collect, use, and safeguard your data when you use our
          services.
        </Text>

        <Text style={styles.heading}>Information We Collect</Text>
        <Text style={styles.text}>
          We collect personal information when you use our services, such as:
          {"\n\n"}• Personal Identification Information: Name, email address,
          phone number, and other details you provide when creating an account
          or submitting inquiries.
          {"\n"}• Usage Data: IP addresses, browser type, and pages visited.
          {"\n"}• Payment Information: If applicable, we may collect payment
          details to process orders.
        </Text>

        <Text style={styles.heading}>How We Use Your Information</Text>
        <Text style={styles.text}>
          We use the information we collect for the following purposes:
          {"\n\n"}• To provide, improve, and personalize our services.
          {"\n"}• To communicate with you regarding your inquiries, orders, and
          account updates.
          {"\n"}• To process payments and fulfill orders.
          {"\n"}• To ensure the security and integrity of our website and
          services.
          {"\n"}• To comply with legal obligations and resolve disputes.
        </Text>

        <Text style={styles.heading}>How We Protect Your Information</Text>
        <Text style={styles.text}>
          We take the security of your personal data seriously. We implement
          industry-standard measures to protect your information from
          unauthorized access, alteration, and destruction, including:
          {"\n\n"}• Secure data storage and encryption methods.
          {"\n"}• Regular audits of our security practices.
          {"\n"}• Limited access to your data by authorized personnel only.
        </Text>

        <Text style={styles.heading}>Sharing Your Information</Text>
        <Text style={styles.text}>
          We do not sell or rent your personal information to third parties.
          However, we may share your information in the following circumstances:
          {"\n\n"}• With service providers such as payment processors, hosting
          providers, and analytics services.
          {"\n"}• In response to legal requests or to comply with the law.
          {"\n"}• To protect the rights, property, or safety of Shaadi Album,
          our users, or the public.
        </Text>

        <Text style={styles.heading}>Your Rights</Text>
        <Text style={styles.text}>
          You have the right to:
          {"\n\n"}• Access the personal information we hold about you.
          {"\n"}• Request correction or deletion of your personal data.
          {"\n"}• Object to the processing of your personal data in certain
          circumstances.
          {"\n\n"}To exercise these rights, please contact us at
          support@shaadialbum.com.
        </Text>

        <Text style={styles.heading}>Cookies</Text>
        <Text style={styles.text}>
          We use cookies and similar technologies to improve your experience on
          our website. You can manage your cookie preferences through your
          browser settings.
        </Text>

        <Text style={styles.heading}>Changes to This Privacy Policy</Text>
        <Text style={styles.text}>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with an updated revision date.
        </Text>

        <Text style={styles.heading}>Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions about this Privacy Policy or how we handle
          your personal information, please contact us at:
          {"\n\n"}Email: shaadialbumofficial@gmail.com
        </Text>

        <Text style={[styles.text, { marginTop: hp(2), textAlign: "center" }]}>
          © 2025 Shaadi Album. All Rights Reserved.
        </Text>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default Policy;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(10),
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginTop: hp(4),
    marginBottom: hp(2),
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: hp(2),
    marginBottom: hp(0.5),
  },
  text: {
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
  },
});
