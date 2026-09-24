"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Building2, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="brand">Academic Inquiries</Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
            Connect with Our Research Team
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Have questions about institutional university licenses, API integration, or academic partnerships? We are here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Contact Details */}
          <div className="md:col-span-5 space-y-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Direct Support</p>
                  <p className="text-sm font-bold text-foreground">support@paperlens.ai</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Institutional Licenses</p>
                  <p className="text-sm font-bold text-foreground">institutions@paperlens.ai</p>
                </div>
              </div>
            </Card>

            <div className="p-4 rounded-2xl bg-muted/40 text-xs text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground">Special Academic Pricing</p>
              <p>
                We offer bulk licensing for universities, doctoral programs, and scientific non-profits. Inquire with your institutional email domain.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7">
            <Card className="p-8">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Inquiry Received</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Thank you for reaching out. A research specialist will respond to your inquiry within 24 business hours.
                  </p>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground mb-2">Send a Message</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Your Name</label>
                      <Input placeholder="Dr. Jane Doe" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Academic Email</label>
                      <Input type="email" placeholder="jane@university.edu" required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Institution / Organization</label>
                    <Input placeholder="University or Research Lab" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Message</label>
                    <Textarea placeholder="How can we assist your research?" rows={4} required />
                  </div>

                  <Button type="submit" variant="academic" className="w-full h-11 font-semibold">
                    Submit Inquiry
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
