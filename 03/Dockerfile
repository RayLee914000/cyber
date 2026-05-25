FROM gcc:13-bookworm AS build

WORKDIR /build
COPY src/warden.c .
RUN gcc -O2 -s -fno-stack-protector -o warden warden.c

FROM debian:bookworm-slim

WORKDIR /challenge
COPY --from=build /build/warden ./warden
COPY README.md .

CMD ["./warden"]
