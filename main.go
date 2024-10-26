package main

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/base64"
	"math/big"
	"syscall/js"
	"time"

	"software.sslmate.com/src/go-pkcs12"
)

var (
	apoptosis = make(chan bool)
)

func invokeApoptosis() {
	apoptosis <- true
}

func GenerateSelfSignedPersonalCertificate(email string, validFor time.Duration, password string) (pfx []byte, certDER []byte) {
	pkixName := pkix.Name{
		CommonName: email,
	}
	validityTimeEpoch := time.Now()
	certTemplate := &x509.Certificate{
		SerialNumber:   big.NewInt(0),
		Issuer:         pkixName,
		Subject:        pkixName,
		NotBefore:      validityTimeEpoch,
		NotAfter:       validityTimeEpoch.Add(validFor),
		KeyUsage:       x509.KeyUsageDigitalSignature,
		ExtKeyUsage:    []x509.ExtKeyUsage{x509.ExtKeyUsageClientAuth},
		EmailAddresses: []string{email},
	}

	key, err := ecdsa.GenerateKey(elliptic.P521(), rand.Reader)
	if err != nil {
		panic(err)
	}

	certDER, err = x509.CreateCertificate(rand.Reader, certTemplate, certTemplate, &key.PublicKey, key)
	if err != nil {
		panic(err)
	}

	certStruct, err := x509.ParseCertificate(certDER)
	if err != nil {
		panic(err)
	}

	pfx, err = pkcs12.Modern.Encode(key, certStruct, []*x509.Certificate{}, password)

	return pfx, certDER
}

func GenerateSelfSignedPersonalCertificateJS(this js.Value, args []js.Value) any {
	pfx, certDER := GenerateSelfSignedPersonalCertificate(args[0].String(), time.Duration(args[1].Int())*time.Second, args[2].String())
	commonBase64Encoder := base64.StdEncoding

	defer invokeApoptosis()

	return map[string]any{
		"key":  commonBase64Encoder.EncodeToString(pfx),
		"cert": commonBase64Encoder.EncodeToString(certDER),
	}
}

func main() {
	js.Global().Set("generateSelfSignedPersonalCertificate", js.FuncOf(GenerateSelfSignedPersonalCertificateJS))
	<-apoptosis
}
