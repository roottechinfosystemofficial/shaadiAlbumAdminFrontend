import html2pdf from "html2pdf.js";

export const printReceipt = ({
    user = {},
    plan = {},
    orderId = "SUB0001",
    paymentDate = new Date().toLocaleDateString(),
    paymentId = "TXN123456",
}) => {
    const logoUrl =
        "https://shaadialbumdemo.s3.ap-south-1.amazonaws.com/eventimages/6859033ffc72e80a23cd1f3c/6859033ffc72e80a23cd1f3d/Original/1751300771554_logo_1.png";

    const htmlContent = `
    <div style="max-width: 800px; margin: auto; padding: 40px; font-family: 'Segoe UI', sans-serif; color: #333; background: linear-gradient(to bottom, #ffffff, #f1f5fb); border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-radius: 10px; background: linear-gradient(to right, #4facfe, #00f2fe); color: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        <img src="${logoUrl}" style="height: 160px;" alt="Logo" crossorigin="anonymous" />
        <div style="text-align: right;">
          <h1 style="margin: 0; font-size: 32px; color: #000;">INVOICE</h1>
<p style="margin: 4px 0; font-size: 14px; color: #000;">Invoice #: <strong>${orderId}</strong></p>
<p style="margin: 4px 0; font-size: 14px; color: #000;">Date: <strong>${paymentDate}</strong></p>

        </div>
      </div>

      <!-- From/To Section -->
      <div style="margin-top: 30px; display: flex; justify-content: space-between; font-size: 14px;">
  <div>
    <strong style="font-size: 16px;">From</strong><br/>
    ShaadiAlbum<br/>
    123 Wedding Street, Mumbai<br/>
    support@shaadialbum.in
  </div>
  <div>
    <strong style="font-size: 16px;">To</strong><br/>
    ${user?.name || "Customer Name"}<br/>
    ${user?.email || "customer@example.com"}<br/>
    ${user?.phoneNo || "N/A"}<br/>
    ${user?.address || "Address not provided"}
  </div>
</div>


      <!-- Item Table -->
      <div style="margin-top: 30px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.05);">
          <thead>
            <tr style="background: linear-gradient(to right, #c2e9fb, #a1c4fd); color: #222;">
              <th style="padding: 12px; border: 1px solid #ccc;">Item</th>
              <th style="padding: 12px; border: 1px solid #ccc;">Description</th>
              <th style="padding: 12px; border: 1px solid #ccc;">Qty</th>
              <th style="padding: 12px; border: 1px solid #ccc;">Price</th>
              <th style="padding: 12px; border: 1px solid #ccc;">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background-color: #ffffff;">
              <td style="padding: 12px; border: 1px solid #eee;">Subscription</td>
              <td style="padding: 12px; border: 1px solid #eee;">${plan?.name || "Standard Plan"} - ${plan?.durationInMonths || 3} Months</td>
              <td style="padding: 12px; border: 1px solid #eee;">1</td>
              <td style="padding: 12px; border: 1px solid #eee;">₹${plan?.subScriptionPrice || 599}</td>
              <td style="padding: 12px; border: 1px solid #eee;">₹${plan?.subScriptionPrice || 599}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div style="text-align: right; font-size: 14px; margin-top: 20px;">
        <p><strong>Subtotal:</strong> ₹${plan?.subScriptionPrice || 599}</p>
        <p><strong>Tax (0%):</strong> ₹0.00</p>
        <h2 style="margin-top: 10px; color: #007bff;">Grand Total: ₹${plan?.subScriptionPrice || 599}</h2>
      </div>

      <!-- Payment Info -->
      <div style="margin-top: 40px; font-size: 14px; flex-direction:"row">
        <strong>Payment Method:</strong> 
        <img style="margin-top: 20px" width="118" height="118" src="https://shaadialbumdemo.s3.ap-south-1.amazonaws.com/eventimages/68574fb230e8df8bda0e9907/68574fb230e8df8bda0e9908/Original/1751340279099_cashfree.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAXYXCP35HRLX3TEG2%2F20250701%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250701T032440Z&X-Amz-Expires=900&X-Amz-Signature=df3ed124ee50d2c5f9b8cba1999683c43ee32d04e23adb663e0a869f9890235b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" alt="Cashfree" height="18" style="vertical-align: middle; margin-left: 4px;" crossorigin="anonymous" />
        <br/>
        <strong>Transaction ID:</strong> ${paymentId}
      </div>

      <!-- Signature -->
      <div style="margin-top: 50px; text-align: center; font-size: 13px;">
        <p>______________________________</p>
        <p><strong>Authorized Signature</strong></p>
      </div>

      <!-- Footer -->
      <p style="font-size: 10px; color: #888; text-align: center; margin-top: 40px;">
        Thank you for your purchase! This is a system-generated invoice. For any support, contact support@shaadialbum.in
      </p>
    </div>
  `;

    const element = document.createElement("div");
    element.innerHTML = htmlContent;

    html2pdf()
        .set({
            margin: 0,
            filename: `ShaadiAlbum_Receipt_${orderId}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();
};
