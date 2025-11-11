# Comprehensive Paystack Payment Integration Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Setup and Configuration](#setup-and-configuration)
4. [Database Schema](#database-schema)
5. [Payment Flow](#payment-flow)
6. [Implementation Steps](#implementation-steps)
7. [API Endpoints](#api-endpoints)
8. [Frontend Implementation](#frontend-implementation)
9. [Webhook Handling](#webhook-handling)
10. [Testing and Deployment](#testing-and-deployment)
11. [Best Practices](#best-practices)

---

## Overview

Paystack is a payment gateway that allows you to accept payments from customers. This guide covers the complete implementation process from initialization through confirmation and database recording.

**Key Benefits:**
- Multiple payment methods (card, bank transfer, USSD, etc.)
- Secure PCI-compliant payment processing
- Real-time payment status updates via webhooks
- Easy integration with REST APIs

---

## Prerequisites

Before starting, you need:

- **Paystack Account**: Sign up at [paystack.com](https://paystack.com)
- **API Keys**: Obtain Public Key and Secret Key from your Paystack dashboard
- **Backend**: Node.js, Python, PHP, or any backend framework
- **Database**: PostgreSQL, MySQL, MongoDB, or similar
- **Frontend**: HTML, React, Vue, Angular, or any frontend framework
- **HTTPS**: Required for production (Paystack requires secure connections)

---

## Setup and Configuration

### 1. Get Your API Keys

1. Log in to your Paystack dashboard
2. Go to **Settings** → **API Keys & Webhooks**
3. Copy your **Public Key** and **Secret Key**

### 2. Environment Configuration

Store your keys in environment variables (never hardcode them):

```bash
# .env file
PAYSTACK_PUBLIC_KEY=pk_live_your_public_key_here
PAYSTACK_SECRET_KEY=sk_live_your_secret_key_here
PAYSTACK_API_URL=https://api.paystack.co
```

### 3. Webhook Configuration

1. In Paystack dashboard, go to **Settings** → **API Keys & Webhooks**
2. Set your webhook URL: `https://yourapp.com/api/webhooks/paystack`
3. Select events to listen to: `charge.success`, `charge.failed`, etc.

---

## Database Schema

### Transactions Table

Store all payment transactions:

```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(50) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NGN',
  status VARCHAR(20) DEFAULT 'pending', -- pending, success, failed, abandoned
  payment_method VARCHAR(50),
  reference VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) NOT NULL,
  metadata JSON,
  paystack_authorization_code VARCHAR(100),
  payment_gateway_response JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_reference (reference),
  INDEX idx_status (status)
);
```

### Users Table

Basic user information:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table (Optional)

Track orders related to payments:

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  transaction_id INT,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, paid, processing, delivered
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);
```

### Payment Logs Table

Log all payment-related activities:

```sql
CREATE TABLE payment_logs (
  id SERIAL PRIMARY KEY,
  transaction_id INT,
  action VARCHAR(100),
  status VARCHAR(50),
  message TEXT,
  response_code VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);
```

---

## Payment Flow

### Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PAYMENT FLOW                                 │
└─────────────────────────────────────────────────────────────────────┘

1. USER INITIATES PAYMENT
   ├─ User enters amount and email
   └─ Frontend sends request to backend

                    ↓

2. BACKEND INITIALIZES PAYMENT
   ├─ Validates input data
   ├─ Generates unique reference
   ├─ Calls Paystack Initialize API
   └─ Stores transaction record (status: pending)

                    ↓

3. PAYSTACK RETURNS AUTHORIZATION URL
   ├─ Backend receives payment link
   └─ Sends link to frontend

                    ↓

4. USER REDIRECTED TO PAYSTACK
   ├─ User enters payment details
   ├─ Selects payment method
   └─ Completes payment

                    ↓

5. PAYSTACK PROCESSES PAYMENT
   ├─ Validates card/account
   ├─ Deducts funds
   └─ Returns to app with reference

                    ↓

6. TWO VERIFICATION PATHS
   ├─ Path A: Frontend Verification
   │  ├─ Backend verifies transaction with Paystack
   │  ├─ Updates transaction status
   │  └─ Redirects user to success/failure page
   │
   └─ Path B: Webhook Verification (Async)
      ├─ Paystack sends webhook event
      ├─ Backend verifies and processes
      └─ Updates transaction status in DB

                    ↓

7. ORDER FULFILLMENT
   ├─ Update order status
   ├─ Send confirmation email
   └─ Initiate delivery/service
```

---

## Implementation Steps

### Step 1: Install Required Packages

**For Node.js/Express:**

```bash
npm install axios dotenv express cors
```

**For Python/Flask:**

```bash
pip install requests python-dotenv flask flask-cors
```

### Step 2: Initialize Payment (Backend)

**Node.js/Express Example:**

```javascript
const axios = require('axios');
const crypto = require('crypto');

// Initialize payment
async function initializePayment(req, res) {
  const { amount, email, userId, description } = req.body;

  // Validate input
  if (!amount || !email || !userId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }

  try {
    // Generate unique reference
    const reference = `${crypto.randomBytes(8).toString('hex')}-${Date.now()}`;

    // Call Paystack API
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: email,
        amount: amount * 100, // Convert to kobo (smallest unit)
        reference: reference,
        metadata: {
          userId: userId,
          description: description
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.status) {
      // Store transaction in database
      await db.query(
        `INSERT INTO transactions
         (transaction_id, user_id, amount, currency, status, reference, email, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [response.data.data.reference, userId, amount, 'NGN', 'pending', reference, email]
      );

      return res.status(200).json({
        success: true,
        message: 'Payment initialized successfully',
        data: {
          authorizationUrl: response.data.data.authorization_url,
          reference: reference
        }
      });
    }
  } catch (error) {
    console.error('Payment initialization error:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment initialization failed',
      error: error.message
    });
  }
}
```

**Python/Flask Example:**

```python
import requests
import os
from datetime import datetime
import secrets

@app.route('/api/payments/initialize', methods=['POST'])
def initialize_payment():
    data = request.json
    amount = data.get('amount')
    email = data.get('email')
    user_id = data.get('userId')
    description = data.get('description')

    if not all([amount, email, user_id]):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    try:
        # Generate unique reference
        reference = f"{secrets.token_hex(8)}-{int(time.time())}"

        # Call Paystack API
        headers = {
            'Authorization': f"Bearer {os.getenv('PAYSTACK_SECRET_KEY')}",
            'Content-Type': 'application/json'
        }

        payload = {
            'email': email,
            'amount': int(amount * 100),  # Convert to kobo
            'reference': reference,
            'metadata': {
                'userId': user_id,
                'description': description
            }
        }

        response = requests.post(
            'https://api.paystack.co/transaction/initialize',
            json=payload,
            headers=headers
        )

        if response.json()['status']:
            result = response.json()['data']

            # Store in database
            db.execute(
                """INSERT INTO transactions
                   (transaction_id, user_id, amount, currency, status, reference, email, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (result['reference'], user_id, amount, 'NGN', 'pending', reference, email, datetime.now())
            )
            db.commit()

            return jsonify({
                'success': True,
                'message': 'Payment initialized successfully',
                'data': {
                    'authorizationUrl': result['authorization_url'],
                    'reference': reference
                }
            }), 200

    except Exception as error:
        print(f'Payment initialization error: {error}')
        return jsonify({'success': False, 'message': str(error)}), 500
```

### Step 3: Verify Payment (Backend)

**Node.js/Express Example:**

```javascript
async function verifyPayment(req, res) {
  const { reference } = req.query;

  if (!reference) {
    return res.status(400).json({
      success: false,
      message: 'Reference is required'
    });
  }

  try {
    // Call Paystack verification API
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const paymentData = response.data.data;

    // Update transaction in database
    if (paymentData.status === 'success') {
      await db.query(
        `UPDATE transactions
         SET status = ?,
             payment_gateway_response = ?,
             paystack_authorization_code = ?,
             payment_method = ?,
             updated_at = NOW()
         WHERE reference = ?`,
        [
          'success',
          JSON.stringify(paymentData),
          paymentData.authorization.authorization_code,
          paymentData.authorization.card_type,
          reference
        ]
      );

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          status: 'success',
          reference: reference,
          amount: paymentData.amount / 100
        }
      });
    } else {
      await db.query(
        `UPDATE transactions SET status = ?, updated_at = NOW() WHERE reference = ?`,
        ['failed', reference]
      );

      return res.status(200).json({
        success: false,
        message: 'Payment verification failed',
        data: { status: 'failed' }
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Verification failed',
      error: error.message
    });
  }
}
```

**Python/Flask Example:**

```python
@app.route('/api/payments/verify/<reference>', methods=['GET'])
def verify_payment(reference):
    try:
        headers = {
            'Authorization': f"Bearer {os.getenv('PAYSTACK_SECRET_KEY')}"
        }

        response = requests.get(
            f'https://api.paystack.co/transaction/verify/{reference}',
            headers=headers
        )

        payment_data = response.json()['data']

        if payment_data['status'] == 'success':
            # Update database
            db.execute(
                """UPDATE transactions
                   SET status = ?, payment_gateway_response = ?,
                       paystack_authorization_code = ?, payment_method = ?,
                       updated_at = ?
                   WHERE reference = ?""",
                ('success', json.dumps(payment_data),
                 payment_data['authorization']['authorization_code'],
                 payment_data['authorization']['card_type'],
                 datetime.now(), reference)
            )
            db.commit()

            return jsonify({
                'success': True,
                'message': 'Payment verified successfully',
                'data': {
                    'status': 'success',
                    'reference': reference,
                    'amount': payment_data['amount'] / 100
                }
            }), 200
        else:
            db.execute(
                "UPDATE transactions SET status = ?, updated_at = ? WHERE reference = ?",
                ('failed', datetime.now(), reference)
            )
            db.commit()

            return jsonify({
                'success': False,
                'message': 'Payment verification failed',
                'data': {'status': 'failed'}
            }), 200

    except Exception as error:
        print(f'Payment verification error: {error}')
        return jsonify({'success': False, 'message': str(error)}), 500
```

---

## API Endpoints

### Paystack API Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/transaction/initialize` | POST | Initialize a payment transaction |
| `/transaction/verify/{reference}` | GET | Verify transaction status |
| `/transaction/list` | GET | List all transactions |
| `/customer` | POST | Create a customer |
| `/customer/{id}` | GET | Get customer details |
| `/authorization/request_requery` | POST | Requery authorization |
| `/charge/create` | POST | Create a charge on customer card |

### Your Backend Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/payments/initialize` | POST | Initialize payment |
| `/api/payments/verify` | GET | Verify payment |
| `/api/payments/history` | GET | Get payment history |
| `/api/webhooks/paystack` | POST | Handle Paystack webhooks |

---

## Frontend Implementation

### HTML Form

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Paystack Payment</title>
  <script src="https://js.paystack.co/v1/inline.js"></script>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .container { max-width: 500px; margin: 0 auto; }
    form { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
    input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px; }
    button { width: 100%; padding: 12px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #0052a3; }
    .error { color: red; margin: 10px 0; }
    .success { color: green; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Make a Payment</h2>
    <form id="paymentForm">
      <input type="text" id="email" placeholder="Email Address" required>
      <input type="number" id="amount" placeholder="Amount (NGN)" min="1" required>
      <input type="text" id="description" placeholder="Description (optional)">
      <button type="submit">Pay Now</button>
    </form>
    <div id="message"></div>
  </div>

  <script>
    document.getElementById('paymentForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const amount = document.getElementById('amount').value;
      const description = document.getElementById('description').value;

      try {
        // Call backend to initialize payment
        const response = await fetch('/api/payments/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            amount: parseFloat(amount),
            userId: 1, // Replace with actual user ID
            description: description
          })
        });

        const result = await response.json();

        if (result.success) {
          // Redirect to Paystack payment page
          window.location.href = result.data.authorizationUrl;
        } else {
          document.getElementById('message').innerHTML =
            `<p class="error">Error: ${result.message}</p>`;
        }
      } catch (error) {
        document.getElementById('message').innerHTML =
          `<p class="error">Error: ${error.message}</p>`;
      }
    });
  </script>
</body>
</html>
```

### React Component

```jsx
import React, { useState } from 'react';

export default function PaymentForm() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amount: parseFloat(amount),
          userId: 1,
          description
        })
      });

      const result = await response.json();

      if (result.success) {
        window.location.href = result.data.authorizationUrl;
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Make a Payment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount (NGN)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
```

---

## Webhook Handling

### Setup Webhook Handler

**Node.js/Express Example:**

```javascript
const crypto = require('crypto');

async function handlePaystackWebhook(req, res) {
  const signature = req.headers['x-paystack-signature'];
  const body = JSON.stringify(req.body);

  // Verify webhook signature
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(body)
    .digest('hex');

  if (hash !== signature) {
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }

  try {
    const event = req.body;

    // Handle charge.success event
    if (event.event === 'charge.success') {
      const reference = event.data.reference;

      // Update transaction status
      await db.query(
        `UPDATE transactions
         SET status = ?,
             payment_gateway_response = ?,
             paystack_authorization_code = ?,
             payment_method = ?,
             updated_at = NOW()
         WHERE reference = ?`,
        [
          'success',
          JSON.stringify(event.data),
          event.data.authorization.authorization_code,
          event.data.authorization.card_type,
          reference
        ]
      );

      // Log the event
      await db.query(
        `INSERT INTO payment_logs (transaction_id, action, status, message, created_at)
         VALUES ((SELECT id FROM transactions WHERE reference = ?), ?, ?, ?, NOW())`,
        [reference, 'charge.success', 'success', 'Payment completed successfully']
      );
    }

    // Handle charge.failed event
    if (event.event === 'charge.failed') {
      const reference = event.data.reference;
      await db.query(
        `UPDATE transactions SET status = ?, updated_at = NOW() WHERE reference = ?`,
        ['failed', reference]
      );
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

// Register webhook endpoint
app.post('/api/webhooks/paystack', express.json(), handlePaystackWebhook);
```

**Python/Flask Example:**

```python
import hmac
import hashlib

@app.route('/api/webhooks/paystack', methods=['POST'])
def handle_paystack_webhook():
    signature = request.headers.get('x-paystack-signature')
    body = request.get_data()

    # Verify signature
    expected_signature = hmac.new(
        os.getenv('PAYSTACK_SECRET_KEY').encode(),
        body,
        hashlib.sha512
    ).hexdigest()

    if signature != expected_signature:
        return jsonify({'success': False, 'message': 'Invalid signature'}), 400

    try:
        event = request.json

        if event['event'] == 'charge.success':
            reference = event['data']['reference']
            db.execute(
                """UPDATE transactions
                   SET status = ?, payment_gateway_response = ?,
                       paystack_authorization_code = ?, payment_method = ?,
                       updated_at = ?
                   WHERE reference = ?""",
                ('success', json.dumps(event['data']),
                 event['data']['authorization']['authorization_code'],
                 event['data']['authorization']['card_type'],
                 datetime.now(), reference)
            )
            db.commit()

        elif event['event'] == 'charge.failed':
            reference = event['data']['reference']
            db.execute(
                "UPDATE transactions SET status = ?, updated_at = ? WHERE reference = ?",
                ('failed', datetime.now(), reference)
            )
            db.commit()

        return jsonify({'success': True}), 200

    except Exception as error:
        print(f'Webhook error: {error}')
        return jsonify({'success': False, 'error': str(error)}), 500
```

---

## Testing and Deployment

### Test Card Numbers

Use these test cards in Paystack's test environment:

| Card Type | Card Number | CVV | Expiry |
|-----------|-------------|-----|--------|
| Visa | 4084 0343 2057 4392 | 123 | Any future date |
| Mastercard | 5425 2334 3010 9903 | 123 | Any future date |

### Test Mode vs Live Mode

1. **Test Mode**: Use test API keys and test cards
2. **Live Mode**: Use live API keys and real payment methods

### Testing Checklist

- [ ] Payment initialization works
- [ ] User is redirected to Paystack correctly
- [ ] Payment processing completes
- [ ] Verification API returns correct status
- [ ] Webhook signature validation works
- [ ] Database records are updated correctly
- [ ] Error handling works for failed payments
- [ ] Email notifications are sent
- [ ] Transaction logs are recorded

### Deployment Steps

1. **Update Environment Variables**
   ```bash
   # Use production API keys
   PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
   PAYSTACK_SECRET_KEY=sk_live_xxxxx
   ```

2. **Set Webhook URL**
   - Go to Paystack dashboard
   - Set webhook URL to your production domain

3. **Enable HTTPS**
   - Ensure your domain uses SSL/TLS

4. **Test in Production**
   - Complete a test transaction
   - Verify webhook delivery

---

## Best Practices

### Security

1. **Never expose secret keys** in frontend code or public repositories
2. **Validate all inputs** on both frontend and backend
3. **Verify webhook signatures** to ensure requests come from Paystack
4. **Use HTTPS** for all payment-related endpoints
5. **Store sensitive data** encrypted in database
6. **Implement rate limiting** on payment endpoints
7. **Log all payment activities** for audit trails

### User Experience

1. **Show clear error messages** to users
2. **Provide transaction reference numbers** to users
3. **Send confirmation emails** with receipt details
4. **Handle network timeouts** gracefully
5. **Implement retry logic** for failed requests
6. **Show payment status** in real-time

### Compliance

1. **Keep audit logs** of all transactions
2. **Comply with data protection** regulations (GDPR, etc.)
3. **Store payment data** securely
4. **Implement fraud detection** measures
5. **Handle chargebacks** appropriately

### Performance

1. **Cache frequently accessed data**
2. **Use database indexes** on key fields
3. **Implement pagination** for transaction lists
4. **Monitor webhook delivery** performance
5. **Set appropriate timeouts** for API calls

### Error Handling

Always handle these scenarios:

- Invalid email format
- Invalid amount (zero or negative)
- Failed API connections
- Webhook delivery failures
- Duplicate transaction attempts
- Expired authorization codes
- Network timeouts during payment

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid public key" | Verify public key is correct and active |
| Webhook not delivering | Check webhook URL, verify signature validation is correct |
| Payment initialized but not verified | Allow time for webhook delivery, manually verify using reference |
| Duplicate transactions | Implement idempotency keys in requests |
| Cards not accepted | Ensure test mode for test cards, live mode for real cards |
| Timeout errors | Increase timeout duration, check network connection |

---

## Additional Resources

- [Paystack Documentation](https://paystack.com/docs)
- [Paystack API Reference](https://paystack.com/docs/api)
- [Webhook Events](https://paystack.com/docs/payments/webhooks)
- [Testing Guide](https://paystack.com/docs/test-keys)

---

## Conclusion

This guide provides a complete implementation of Paystack payments. Remember to:
- Test thoroughly in test mode
- Implement proper error handling
- Secure your API keys
- Monitor transaction logs
- Keep your webhook URL up to date

For additional support, refer to Paystack's official documentation or contact their support team.
